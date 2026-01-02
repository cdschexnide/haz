import {
  parse,
  visit,
  ObjectTypeDefinitionNode,
} from "graphql";
import { Project, VariableDeclarationKind, ScriptKind } from "ts-morph";

function getTypeName(typeNode: any): string {
  while (typeNode.kind === "NonNullType" || typeNode.kind === "ListType") {
    typeNode = typeNode.type;
  }
  return typeNode.name?.value ?? "";
}

export const generateQueryResolvers = async (
  schema: string,
  outputDir?: string
): Promise<Project> => {
  const graphqlAst = parse(schema);
  const ignoreTypes = ["Mutation", "Subscription"];

  const queryFields: { name: string; type: string }[] = [];

  // Collect Query fields
  visit(graphqlAst, {
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      if (node.name.value === "Query") {
        node.fields?.forEach((field) => {
          const typeName = getTypeName(field.type);
          queryFields.push({
            name: field.name.value,
            type: typeName,
          });
        });
      }
    },
  });

  // --- Generate output file with ts-morph ---
  const project = new Project({ libFolderPath: outputDir });

  const filePath = `${outputDir ?? "."}/__generated__/query-resolvers.ts`;
  const sourceFile = project.createSourceFile(filePath, "", {
    scriptKind: ScriptKind.TS,
    overwrite: true,
  });

  // Add imports
  sourceFile.addImportDeclaration({
    namedImports: ["store"],
    moduleSpecifier: "./store", // adjust to your store path
  });
  sourceFile.addImportDeclaration({
    namedImports: queryFields.map((field) => `Valtio${field.type}`),
    moduleSpecifier: "./../types", // adjust to your store path
  });

  // Build the resolvers object
  const resolverArrayText = queryFields
    .map((q) => {
      return `${q.name}: async () => {
  const entities: Valtio${q.type}[] = [];
  for (const entity of Object.values(store.${q.type}Map)) {
    if (entity) entities.push(entity);
  }
  return entities;
}`;
    })
    .join(",\n");

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: "queryResolvers",
        initializer: `{
          ${resolverArrayText}
        }`,
      },
    ],
  });

  sourceFile.formatText();
  await sourceFile.save();
  return project;
};
