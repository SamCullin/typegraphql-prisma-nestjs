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
var path_1 = require("path");
var helpers_1 = require("../helpers");
var args_class_1 = require("../args-class");
var config_1 = require("../config");
var imports_1 = require("../imports");
var saveSourceFile_1 = require("../../utils/saveSourceFile");
function generateRelationsResolverClassesFromModel(
  project,
  baseDirPath,
  model,
  mapping,
  outputType,
  modelNames,
) {
  return __awaiter(this, void 0, void 0, function () {
    var resolverName,
      rootArgName,
      relationFields,
      singleIdField,
      singleUniqueField,
      singleFilterField,
      compositeIdFields,
      compositeUniqueFields,
      compositeFilterFields,
      resolverDirPath,
      filePath,
      sourceFile,
      methodsInfo,
      argTypeNames,
      barrelExportSourceFile;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          resolverName = model.name + "RelationsResolver";
          rootArgName = helpers_1.camelCase(model.name);
          relationFields = model.fields.filter(function (field) {
            return field.relationName;
          });
          singleIdField = model.fields.find(function (field) {
            return field.isId;
          });
          singleUniqueField = model.fields.find(function (field) {
            return field.isUnique;
          });
          singleFilterField =
            singleIdField !== null && singleIdField !== void 0
              ? singleIdField
              : singleUniqueField;
          compositeIdFields = model.fields.filter(function (field) {
            return model.idFields.includes(field.name);
          });
          compositeUniqueFields = model.fields.filter(function (field) {
            var _a;
            return (_a =
              // taking first unique group is enough to fetch entity
              model.uniqueFields[0]) === null || _a === void 0
              ? void 0
              : _a.includes(field.name);
          });
          compositeFilterFields =
            compositeIdFields.length > 0
              ? compositeIdFields
              : compositeUniqueFields;
          resolverDirPath = path_1["default"].resolve(
            baseDirPath,
            config_1.resolversFolderName,
            config_1.relationsResolversFolderName,
            model.name,
          );
          filePath = path_1["default"].resolve(
            resolverDirPath,
            resolverName + ".ts",
          );
          sourceFile = project.createSourceFile(filePath, undefined, {
            overwrite: true,
          });
          return [
            4 /*yield*/,
            Promise.all(
              relationFields.map(function (field) {
                return __awaiter(_this, void 0, void 0, function () {
                  var outputTypeField, fieldDocs, fieldType, argsTypeName;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        outputTypeField = outputType.fields.find(function (it) {
                          return it.name === field.name;
                        });
                        fieldDocs = undefined;
                        fieldType = helpers_1.getFieldTSType(field, modelNames);
                        if (!(outputTypeField.args.length > 0))
                          return [3 /*break*/, 2];
                        return [
                          4 /*yield*/,
                          args_class_1["default"](
                            project,
                            resolverDirPath,
                            outputTypeField.args,
                            model.name + helpers_1.pascalCase(field.name),
                            modelNames,
                          ),
                        ];
                      case 1:
                        argsTypeName = _a.sent();
                        _a.label = 2;
                      case 2:
                        return [
                          2 /*return*/,
                          {
                            field: field,
                            fieldDocs: fieldDocs,
                            fieldType: fieldType,
                            argsTypeName: argsTypeName,
                          },
                        ];
                    }
                  });
                });
              }),
            ),
          ];
        case 1:
          methodsInfo = _a.sent();
          argTypeNames = methodsInfo
            .filter(function (it) {
              return it.argsTypeName !== undefined;
            })
            .map(function (it) {
              return it.argsTypeName;
            });
          barrelExportSourceFile = project.createSourceFile(
            path_1["default"].resolve(
              resolverDirPath,
              config_1.argsFolderName,
              "index.ts",
            ),
            undefined,
            { overwrite: true },
          );
          if (!argTypeNames.length) return [3 /*break*/, 3];
          imports_1.generateArgsBarrelFile(
            barrelExportSourceFile,
            argTypeNames,
          );
          return [
            4 /*yield*/,
            saveSourceFile_1["default"](barrelExportSourceFile),
          ];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          imports_1.generateTypeGraphQLImport(sourceFile);
          imports_1.generateModelsImports(
            sourceFile,
            __spreadArrays(
              relationFields.map(function (field) {
                return field.type;
              }),
              [model.name],
            ),
            3,
          );
          imports_1.generateArgsImports(sourceFile, argTypeNames, 0);
          sourceFile.addClass({
            name: resolverName,
            isExported: true,
            decorators: [
              {
                name: "Resolver",
                arguments: [
                  "_of => " + helpers_1.getBaseModelTypeName(model.name),
                ],
              },
            ],
            methods: methodsInfo.map(function (_a) {
              var field = _a.field,
                fieldType = _a.fieldType,
                fieldDocs = _a.fieldDocs,
                argsTypeName = _a.argsTypeName;
              var whereConditionString = "";
              // TODO: refactor to AST
              if (singleFilterField) {
                whereConditionString =
                  "\n            " +
                  singleFilterField.name +
                  ": " +
                  rootArgName +
                  "." +
                  singleFilterField.name +
                  ",\n          ";
              } else if (compositeFilterFields.length > 0) {
                whereConditionString =
                  "\n            " +
                  compositeFilterFields
                    .map(function (it) {
                      return it.name;
                    })
                    .join("_") +
                  ": {\n              " +
                  compositeFilterFields
                    .map(function (idField) {
                      return (
                        idField.name +
                        ": " +
                        rootArgName +
                        "." +
                        idField.name +
                        ","
                      );
                    })
                    .join("\n") +
                  "\n            },\n          ";
              } else {
                throw new Error(
                  "Unexpected error happened on generating 'whereConditionString' for " +
                    model.name +
                    " relation resolver",
                );
              }
              return {
                name: field.name,
                isAsync: true,
                returnType: "Promise<" + fieldType + ">",
                decorators: [
                  {
                    name: "ResolveField",
                    arguments: [
                      "'" + field.name + "'",
                      "_type => " +
                        helpers_1.getTypeGraphQLType(field, modelNames),
                      "{\n                  nullable: " +
                        !field.isRequired +
                        ",\n                  description: " +
                        (fieldDocs ? '"' + fieldDocs + '"' : "undefined") +
                        ",\n                }",
                    ],
                  },
                ],
                parameters: __spreadArrays(
                  [
                    {
                      name: rootArgName,
                      type: "" + helpers_1.getBaseModelTypeName(model.name),
                      decorators: [{ name: "Root", arguments: [] }],
                    },
                    {
                      name: "ctx",
                      // TODO: import custom `ContextType`
                      type: "any",
                      decorators: [{ name: "Context", arguments: [] }],
                    },
                  ],
                  !argsTypeName
                    ? []
                    : [
                        {
                          name: "args",
                          type: argsTypeName,
                          decorators: [{ name: "Args", arguments: [] }],
                        },
                      ],
                ),
                // TODO: refactor to AST
                statements: [
                  "return ctx.prisma." +
                    helpers_1.camelCase(model.name) +
                    ".findOne({\n              where: {" +
                    whereConditionString +
                    "},\n            })." +
                    field.name +
                    "(" +
                    (argsTypeName ? "args" : "{}") +
                    ");",
                ],
              };
            }),
          });
          return [4 /*yield*/, saveSourceFile_1["default"](sourceFile)];
        case 4:
          _a.sent();
          return [
            2 /*return*/,
            {
              modelName: model.name,
              resolverName: resolverName,
              argTypeNames: argTypeNames,
            },
          ];
      }
    });
  });
}
exports["default"] = generateRelationsResolverClassesFromModel;
