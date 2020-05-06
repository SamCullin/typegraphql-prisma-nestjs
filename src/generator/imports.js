"use strict";
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
exports.__esModule = true;
var path_1 = require("path");
var config_1 = require("./config");
function generateTypeGraphQLImport(sourceFile) {
  sourceFile.addImportDeclaration({
    moduleSpecifier: "@nestjs/graphql",
    namedImports: [
      "Resolver",
      "ResolveField",
      "Root",
      "Context",
      "Query",
      "Mutation",
      "Args",
      "registerEnumType",
      "ObjectType",
      "Field",
      "Int",
      "Float",
      "ID",
      "InputType",
      "ArgsType",
    ].sort(),
  });
}
exports.generateTypeGraphQLImport = generateTypeGraphQLImport;
function generateArgsBarrelFile(sourceFile, argsTypeNames) {
  sourceFile.addExportDeclarations(
    argsTypeNames.sort().map(function (argTypeName) {
      return {
        moduleSpecifier: "./" + argTypeName,
        namedExports: [argTypeName],
      };
    }),
  );
}
exports.generateArgsBarrelFile = generateArgsBarrelFile;
function generateModelsBarrelFile(sourceFile, modelNames) {
  sourceFile.addExportDeclarations(
    modelNames.sort().map(function (modelName) {
      return {
        moduleSpecifier: "./" + modelName,
        namedExports: [modelName],
      };
    }),
  );
}
exports.generateModelsBarrelFile = generateModelsBarrelFile;
function generateEnumsBarrelFile(sourceFile, enumTypeNames) {
  sourceFile.addExportDeclarations(
    enumTypeNames.sort().map(function (enumTypeName) {
      return {
        moduleSpecifier: "./" + enumTypeName,
        namedExports: [enumTypeName],
      };
    }),
  );
}
exports.generateEnumsBarrelFile = generateEnumsBarrelFile;
function generateInputsBarrelFile(sourceFile, inputTypeNames) {
  sourceFile.addExportDeclarations(
    inputTypeNames.sort().map(function (inputTypeName) {
      return {
        moduleSpecifier: "./" + inputTypeName,
        namedExports: [inputTypeName],
      };
    }),
  );
}
exports.generateInputsBarrelFile = generateInputsBarrelFile;
function generateOutputsBarrelFile(sourceFile, outputTypeNames, hasSomeArgs) {
  sourceFile.addExportDeclarations(
    outputTypeNames.sort().map(function (outputTypeName) {
      return {
        moduleSpecifier: "./" + outputTypeName,
        namedExports: [outputTypeName],
      };
    }),
  );
  if (hasSomeArgs) {
    sourceFile.addExportDeclaration({
      moduleSpecifier: "./" + config_1.argsFolderName,
    });
  }
}
exports.generateOutputsBarrelFile = generateOutputsBarrelFile;
function generateIndexFile(sourceFile, hasSomeRelations) {
  sourceFile.addExportDeclarations(
    __spreadArrays(
      [
        { moduleSpecifier: "./" + config_1.enumsFolderName },
        { moduleSpecifier: "./" + config_1.modelsFolderName },
        {
          moduleSpecifier:
            "./" +
            config_1.resolversFolderName +
            "/" +
            config_1.crudResolversFolderName,
        },
      ],
      hasSomeRelations
        ? [
            {
              moduleSpecifier:
                "./" +
                config_1.resolversFolderName +
                "/" +
                config_1.relationsResolversFolderName,
            },
          ]
        : [],
      [
        {
          moduleSpecifier:
            "./" +
            config_1.resolversFolderName +
            "/" +
            config_1.inputsFolderName,
        },
        {
          moduleSpecifier:
            "./" +
            config_1.resolversFolderName +
            "/" +
            config_1.outputsFolderName,
        },
      ],
    ),
  );
}
exports.generateIndexFile = generateIndexFile;
function generateResolversBarrelFile(type, sourceFile, relationResolversData) {
  relationResolversData
    .sort(function (a, b) {
      return a.modelName > b.modelName ? 1 : a.modelName < b.modelName ? -1 : 0;
    })
    .forEach(function (_a) {
      var modelName = _a.modelName,
        resolverName = _a.resolverName,
        actionResolverNames = _a.actionResolverNames,
        argTypeNames = _a.argTypeNames;
      sourceFile.addImportDeclaration({
        moduleSpecifier: "./" + modelName + "/" + resolverName,
        namedImports: [resolverName].sort(),
      });
      sourceFile.addExportDeclaration({
        moduleSpecifier: "./" + modelName + "/" + resolverName,
        namedExports: [resolverName],
      });
      if (actionResolverNames) {
        actionResolverNames.forEach(function (actionResolverName) {
          sourceFile.addExportDeclaration({
            moduleSpecifier: "./" + modelName + "/" + actionResolverName,
            namedExports: [actionResolverName],
          });
        });
      }
      if (argTypeNames.length) {
        sourceFile.addExportDeclaration({
          moduleSpecifier: "./" + modelName + "/args",
        });
      }
    });
  var moduleName =
    type === "crud" ? "CrudResolversModule" : "RelationsResolversModule";
  var providers = relationResolversData
    .sort(function (a, b) {
      return a.modelName > b.modelName ? 1 : a.modelName < b.modelName ? -1 : 0;
    })
    .map(function (_a) {
      var resolverName = _a.resolverName;
      return resolverName;
    });
  sourceFile.addImportDeclaration({
    moduleSpecifier: "@nestjs/common",
    namedImports: ["Module"].sort(),
  });
  sourceFile.addClass({
    name: moduleName,
    isExported: true,
    decorators: [
      {
        name: "Module",
        arguments: [
          "{\n  providers: [\n    " +
            providers.join(",\n    ") +
            "\n  ],\n  exports: [\n    " +
            providers.join(",\n    ") +
            "\n  ]\n}",
        ],
      },
    ],
  });
}
exports.generateResolversBarrelFile = generateResolversBarrelFile;
exports.generateModelsImports = createImportGenerator(
  config_1.modelsFolderName,
);
exports.generateEnumsImports = createImportGenerator(config_1.enumsFolderName);
exports.generateInputsImports = createImportGenerator(
  config_1.inputsFolderName,
);
exports.generateOutputsImports = createImportGenerator(
  config_1.outputsFolderName,
);
exports.generateArgsImports = createImportGenerator(config_1.argsFolderName);
function createImportGenerator(elementsDirName) {
  return function (sourceFile, elementsNames, level) {
    var _a;
    if (level === void 0) {
      level = 1;
    }
    var distinctElementsNames = __spreadArrays(new Set(elementsNames)).sort();
    for (
      var _i = 0, distinctElementsNames_1 = distinctElementsNames;
      _i < distinctElementsNames_1.length;
      _i++
    ) {
      var elementName = distinctElementsNames_1[_i];
      sourceFile.addImportDeclaration({
        moduleSpecifier:
          (level === 0 ? "./" : "") +
          (_a = path_1["default"].posix).join.apply(
            _a,
            __spreadArrays(Array(level).fill(".."), [
              elementsDirName,
              elementName,
            ]),
          ),
        // TODO: refactor to default exports
        // defaultImport: elementName,
        namedImports: [elementName],
      });
    }
  };
}
