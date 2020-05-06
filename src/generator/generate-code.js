"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
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
var ts_morph_1 = require("ts-morph");
var path_1 = require("path");
var helpers_1 = require("./helpers");
var enum_1 = require("./enum");
var model_type_class_1 = require("./model-type-class");
var relations_1 = require("./resolvers/relations");
var type_class_1 = require("./type-class");
var full_crud_1 = require("./resolvers/full-crud");
var config_1 = require("./config");
var imports_1 = require("./imports");
var saveSourceFile_1 = require("../utils/saveSourceFile");
exports.defaultHooks = {
  generateEnumFromDef: enum_1["default"],
  generateEnumsBarrelFile: imports_1.generateEnumsBarrelFile,
  generateObjectTypeClassFromModel: model_type_class_1["default"],
  generateModelsBarrelFile: imports_1.generateModelsBarrelFile,
  generateOutputTypeClassFromType: type_class_1.generateOutputTypeClassFromType,
  generateArgsBarrelFile: imports_1.generateArgsBarrelFile,
  generateOutputsBarrelFile: imports_1.generateOutputsBarrelFile,
  generateInputTypeClassFromType: type_class_1.generateInputTypeClassFromType,
  generateInputsBarrelFile: imports_1.generateInputsBarrelFile,
  generateRelationsResolverClassesFromModel: relations_1["default"],
  generateResolversBarrelFile: imports_1.generateResolversBarrelFile,
  generateCrudResolverClassFromMapping: full_crud_1["default"],
  generateIndexFile: imports_1.generateIndexFile,
};
function generateCode(dmmf, options, hook, log) {
  if (hook === void 0) {
    hook = exports.defaultHooks;
  }
  if (log === void 0) {
    log = helpers_1.noop;
  }
  return __awaiter(this, void 0, void 0, function () {
    var baseDirPath,
      project,
      resolversDirPath,
      modelNames,
      datamodelEnumNames,
      emittedEnumNames,
      enumsBarrelExportSourceFile,
      modelsBarrelExportSourceFile,
      rootTypes,
      outputTypesToGenerate,
      argsTypesNamesArray,
      argsTypesNames,
      outputsArgsBarrelExportSourceFile,
      outputsBarrelExportSourceFile,
      inputsBarrelExportSourceFile,
      relationResolversData,
      relationResolversBarrelExportSourceFile,
      crudResolversData,
      crudResolversBarrelExportSourceFile,
      indexSourceFile;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          baseDirPath = options.outputDirPath;
          project = new ts_morph_1.Project();
          resolversDirPath = path_1["default"].resolve(
            baseDirPath,
            config_1.resolversFolderName,
          );
          modelNames = dmmf.datamodel.models.map(function (model) {
            return model.name;
          });
          log("Generating enums...");
          datamodelEnumNames = dmmf.datamodel.enums.map(function (enumDef) {
            return enumDef.name;
          });
          return [
            4 /*yield*/,
            Promise.all(
              dmmf.datamodel.enums.map(function (enumDef) {
                return hook.generateEnumFromDef(project, baseDirPath, enumDef);
              }),
            ),
          ];
        case 1:
          _a.sent();
          return [
            4 /*yield*/,
            Promise.all(
              dmmf.schema.enums
                // skip enums from datamodel
                .filter(function (enumDef) {
                  return !datamodelEnumNames.includes(enumDef.name);
                })
                .map(function (enumDef) {
                  return hook.generateEnumFromDef(
                    project,
                    baseDirPath,
                    enumDef,
                  );
                }),
            ),
          ];
        case 2:
          _a.sent();
          emittedEnumNames = __spreadArrays(
            new Set(
              __spreadArrays(
                dmmf.schema.enums.map(function (it) {
                  return it.name;
                }),
                dmmf.datamodel.enums.map(function (it) {
                  return it.name;
                }),
              ),
            ),
          );
          enumsBarrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              baseDirPath,
              config_1.enumsFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          hook.generateEnumsBarrelFile(
            enumsBarrelExportSourceFile,
            emittedEnumNames,
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](enumsBarrelExportSourceFile),
          ];
        case 3:
          _a.sent();
          log("Generating models...");
          return [
            4 /*yield*/,
            Promise.all(
              dmmf.datamodel.models.map(function (model) {
                return hook.generateObjectTypeClassFromModel(
                  project,
                  baseDirPath,
                  model,
                  modelNames,
                );
              }),
            ),
          ];
        case 4:
          _a.sent();
          modelsBarrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              baseDirPath,
              config_1.modelsFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          hook.generateModelsBarrelFile(
            modelsBarrelExportSourceFile,
            dmmf.datamodel.models.map(function (it) {
              return it.name;
            }),
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](modelsBarrelExportSourceFile),
          ];
        case 5:
          _a.sent();
          log("Generating output types...");
          rootTypes = dmmf.schema.outputTypes.filter(function (type) {
            return ["Query", "Mutation"].includes(type.name);
          });
          outputTypesToGenerate = dmmf.schema.outputTypes.filter(
            // skip generating models and root resolvers
            function (type) {
              return (
                !modelNames.includes(type.name) && !rootTypes.includes(type)
              );
            },
          );
          return [
            4 /*yield*/,
            Promise.all(
              outputTypesToGenerate.map(function (type) {
                return hook.generateOutputTypeClassFromType(
                  project,
                  resolversDirPath,
                  type,
                  modelNames,
                );
              }),
            ),
          ];
        case 6:
          argsTypesNamesArray = _a.sent();
          argsTypesNames = argsTypesNamesArray.reduce(function (a, b) {
            return a.concat(b);
          }, []);
          outputsArgsBarrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              baseDirPath,
              config_1.resolversFolderName,
              config_1.outputsFolderName,
              config_1.argsFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          hook.generateArgsBarrelFile(
            outputsArgsBarrelExportSourceFile,
            argsTypesNames,
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](outputsArgsBarrelExportSourceFile),
          ];
        case 7:
          _a.sent();
          outputsBarrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              baseDirPath,
              config_1.resolversFolderName,
              config_1.outputsFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          hook.generateOutputsBarrelFile(
            outputsBarrelExportSourceFile,
            outputTypesToGenerate.map(function (it) {
              return it.name;
            }),
            argsTypesNames.length > 0,
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](outputsBarrelExportSourceFile),
          ];
        case 8:
          _a.sent();
          log("Generating input types...");
          return [
            4 /*yield*/,
            Promise.all(
              dmmf.schema.inputTypes.map(function (type) {
                return hook.generateInputTypeClassFromType(
                  project,
                  resolversDirPath,
                  type,
                  modelNames,
                );
              }),
            ),
          ];
        case 9:
          _a.sent();
          inputsBarrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              baseDirPath,
              config_1.resolversFolderName,
              config_1.inputsFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          hook.generateInputsBarrelFile(
            inputsBarrelExportSourceFile,
            dmmf.schema.inputTypes.map(function (it) {
              return it.name;
            }),
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](inputsBarrelExportSourceFile),
          ];
        case 10:
          _a.sent();
          log("Generating relation resolvers...");
          return [
            4 /*yield*/,
            Promise.all(
              dmmf.datamodel.models
                .filter(function (model) {
                  return model.fields.some(function (field) {
                    return field.relationName;
                  });
                })
                .map(function (model) {
                  var outputType = dmmf.schema.outputTypes.find(function (
                    type,
                  ) {
                    return type.name === model.name;
                  });
                  var mapping = dmmf.mappings.find(function (it) {
                    return it.model === model.name;
                  });
                  return hook.generateRelationsResolverClassesFromModel(
                    project,
                    baseDirPath,
                    model,
                    mapping,
                    outputType,
                    modelNames,
                  );
                }),
            ),
          ];
        case 11:
          relationResolversData = _a.sent();
          if (!(relationResolversData.length > 0)) return [3 /*break*/, 13];
          relationResolversBarrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              baseDirPath,
              config_1.resolversFolderName,
              config_1.relationsResolversFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          hook.generateResolversBarrelFile(
            "relations",
            relationResolversBarrelExportSourceFile,
            relationResolversData,
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](
              relationResolversBarrelExportSourceFile,
            ),
          ];
        case 12:
          _a.sent();
          _a.label = 13;
        case 13:
          log("Generating crud resolvers...");
          return [
            4 /*yield*/,
            Promise.all(
              dmmf.mappings.map(function (mapping) {
                var model = dmmf.datamodel.models.find(function (model) {
                  return model.name === mapping.model;
                });
                return hook.generateCrudResolverClassFromMapping(
                  project,
                  baseDirPath,
                  mapping,
                  model,
                  rootTypes,
                  modelNames,
                  options,
                );
              }),
            ),
          ];
        case 14:
          crudResolversData = _a.sent();
          crudResolversBarrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              baseDirPath,
              config_1.resolversFolderName,
              config_1.crudResolversFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          hook.generateResolversBarrelFile(
            "crud",
            crudResolversBarrelExportSourceFile,
            crudResolversData,
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](crudResolversBarrelExportSourceFile),
          ];
        case 15:
          _a.sent();
          log("Generating index file");
          indexSourceFile = project.createSourceFile(
            baseDirPath + "/index.ts",
            undefined,
            { overwrite: true },
          );
          hook.generateIndexFile(
            indexSourceFile,
            relationResolversData.length > 0,
          );
          return [4 /*yield*/, saveSourceFile_1["default"](indexSourceFile)];
        case 16:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
exports["default"] = generateCode;
