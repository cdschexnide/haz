import {
  parse,
  visit,
  DirectiveNode,
  StringValueNode,
} from 'graphql';
import { Project, ScriptKind, VariableDeclarationKind } from 'ts-morph';

export type EntityInfo = {
  isSyncable: boolean;
  entityName: string;
}

function uncapitalize(str: string): string {
  if (!str) return ""; // handle empty string
  return str.charAt(0).toLowerCase() + str.slice(1);
} 

export const generateEntitySyncPaths = async (schema: string, outputDir?: string): Promise<Project> => {
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

  const serviceName = outputDir?.split('/')[3].split('-').slice(0,-1).join('-')
  
  const sourceFile = project.createSourceFile(`${outputDir ?? '.'}/__generated__/syncPaths.ts`, '', {
    scriptKind: ScriptKind.TS,
    overwrite: true,
  });

  const syncableEntityNames = Object.entries(entities).filter(([entityName, entity]) => entity.isSyncable).map(([entityName, _]) => entityName)
  syncableEntityNames.forEach((entityName) => {
    sourceFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: `get${entityName}SyncPath`,
          initializer: `(uuid: string) => \`${serviceName}/${uncapitalize(entityName)}/\${uuid}\``,
        }],
    });
  })
  return project;
}