import {
  parse,
  visit,
  DirectiveNode,
  StringValueNode,
  ListValueNode,
} from 'graphql';
import { Project, ScriptKind, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export type DirectiveMap = Record<string, Array<{ key: string, value: string }>>

export type EntityInfo = {
  isSyncable: boolean;
  entityName: string;
}

export const createValtioStore = async (schema: string, outputDir?: string): Promise<Project> => {
  const graphqlAst = parse(schema);

  const entities: Record<string, EntityInfo> = {};

  visit(graphqlAst, {
    ObjectTypeDefinition(node) {
      const entityName = node.name.value;
      if (entityName === 'Query' || entityName === 'Mutation') {
        return;
      }

      const entityIsSyncable = !!node.directives?.find((directive: DirectiveNode) => (directive.name.value === 'tag' && ((directive.arguments?.find(arg => arg.name.value === 'name')?.value as StringValueNode).value === 'sync')))
      entities[entityName] = {
        entityName,
        isSyncable: entityIsSyncable,
      };
    },
  });

  const project = new Project({ libFolderPath: outputDir });

  const filePath = `${outputDir ?? '.'}/__generated__/store.ts`;

  const sourceFile = project.createSourceFile(filePath, '', {
    scriptKind: ScriptKind.TS,
    overwrite: true
  });

  sourceFile.addImportDeclarations([
    {
      namedImports: ['proxy'],
      moduleSpecifier: 'valtio',
    },
  ]);

  const storeInterface = sourceFile.addInterface({
    name: "Store",
    properties: [
      {
        name: "create",
        type: '<K extends object>(objs: K[]) => Promise<string>'
      }
    ]
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [{
      name: 'store',
      initializer: writer => {
        writer.write('proxy<Store>({})');
      },
    }
    ]
  });

  const storeVar = sourceFile.getVariableDeclarationOrThrow('store');
  const callExpr = storeVar.getInitializerIfKindOrThrow(SyntaxKind.CallExpression);
  const objectArg = callExpr.getArguments()[0].asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  objectArg.addPropertyAssignment({
    name: 'create',
    initializer: `<K extends object>(objs: K[]) => {
        throw new Error("not implemented");
      },`
  });

  Object.values(entities).filter((entity) => entity.isSyncable).forEach((entity) => {
    sourceFile.addTypeAlias({
      name: `${entity.entityName}Record`,
      type: `Record<string, Valtio${entity.entityName} | undefined>`,
      isExported: true, // Optional: if you want to export the type
    });

    storeInterface.addProperty({
      name: `${entity.entityName}Map`,
      type: `${entity.entityName}Record`
    })
  });

  const imports: string[] = [];
  Object.entries(entities).filter(([, entity]) => entity.isSyncable).forEach(([entityName, entity]) => {
    imports.push(`Valtio${entityName}`)

    objectArg.addPropertyAssignment({
      name: `${entityName}Map`,
      initializer: `{},`
    });
  });

  sourceFile.addImportDeclarations([
    {
      namedImports: imports,
      moduleSpecifier: `./../types`,
    }]);

  return project;
}