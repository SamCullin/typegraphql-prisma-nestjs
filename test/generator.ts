import { generatorHandler } from "@prisma/generator-helper";

import { configureGenerator } from "../src/cli/config-generator";

generatorHandler({
  onManifest: () => ({
    defaultOutput: "node_modules/@generated/type-graphql",
    prettyName: "TypeGraphQL integration",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: configureGenerator({
    hooks: {},
  }),
});
