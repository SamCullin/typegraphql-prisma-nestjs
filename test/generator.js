"use strict";
exports.__esModule = true;
var generator_helper_1 = require("@prisma/generator-helper");
var config_generator_1 = require("../src/cli/config-generator");
generator_helper_1.generatorHandler({
  onManifest: function () {
    return {
      defaultOutput: "node_modules/@generated/type-graphql",
      prettyName: "TypeGraphQL integration",
      requiresGenerators: ["prisma-client-js"],
    };
  },
  onGenerate: config_generator_1.configureGenerator({
    hooks: {},
  }),
});
