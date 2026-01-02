import { readFile, access, mkdir } from "fs/promises";
import { join } from "path";
import { createValtioTypesFromSchema } from "./code-generators/generate-valtio-types";
import { createValtioStore } from "./code-generators/generate-valtio-store";
import { createYDocFromSchema } from "./code-generators/generate-ydoc-types";
import { generateQueryResolvers } from "./code-generators/generate-query-resolvers";

const generateAll = async () => {
  const schema = await readFile(
    join(__dirname, "graphql/schema.graphql"),
    "utf8"
  );

  // 1. Generate YDoc types
  const ydocProject = await createYDocFromSchema(schema, join(__dirname, "utils/yjs"));
  await ydocProject.save();

  // 2. Generate Valtio store
  const storeProject = await createValtioStore(schema, join(__dirname, "utils/valtio"));
  await storeProject.save();

  // 3. Generate Valtio types
  const typesProject = await createValtioTypesFromSchema(
    schema,
    join(__dirname, "utils/valtio/types")
  );
  await typesProject.save();

  // 4. Generate query resolvers
  const resolversProject = await generateQueryResolvers(schema, join(__dirname, "utils/valtio"));
  await resolversProject.save();
};

generateAll();
