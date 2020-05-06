"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
exports.__esModule = true;
var path_1 = require("path");
var helpers_1 = require("./helpers");
var config_1 = require("./config");
var imports_1 = require("./imports");
var saveSourceFile_1 = require("../utils/saveSourceFile");
var args_class_1 = require("./args-class");
function generateOutputTypeClassFromType(project, dirPath, type, modelNames) {
  return __awaiter(this, void 0, void 0, function () {
    var fileDirPath, filePath, sourceFile, fieldsInfo, fieldArgsTypeNames;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          fileDirPath = path_1["default"].resolve(
            dirPath,
            config_1.outputsFolderName,
          );
          filePath = path_1["default"].resolve(fileDirPath, type.name + ".ts");
          sourceFile = project.createSourceFile(filePath, undefined, {
            overwrite: true,
          });
          return [
            4 /*yield*/,
            Promise.all(
              type.fields.map(function (field) {
                return __awaiter(_this, void 0, void 0, function () {
                  var argsTypeName;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        if (!(field.args.length > 0)) return [3 /*break*/, 2];
                        return [
                          4 /*yield*/,
                          args_class_1["default"](
                            project,
                            fileDirPath,
                            field.args,
                            "" + type.name + helpers_1.pascalCase(field.name),
                            modelNames,
                            2,
                          ),
                        ];
                      case 1:
                        argsTypeName = _a.sent();
                        _a.label = 2;
                      case 2:
                        return [
                          2 /*return*/,
                          __assign(__assign({}, field), {
                            argsTypeName: argsTypeName,
                          }),
                        ];
                    }
                  });
                });
              }),
            ),
          ];
        case 1:
          fieldsInfo = _a.sent();
          fieldArgsTypeNames = fieldsInfo
            .filter(function (it) {
              return it.argsTypeName;
            })
            .map(function (it) {
              return it.argsTypeName;
            });
          imports_1.generateTypeGraphQLImport(sourceFile);
          imports_1.generateArgsImports(sourceFile, fieldArgsTypeNames, 0);
          sourceFile.addClass({
            name: type.name,
            isExported: true,
            decorators: [
              {
                name: "ObjectType",
                arguments: [
                  "{\n            isAbstract: true,\n            description: undefined,\n          }",
                ],
              },
            ],
            properties: fieldsInfo
              .filter(function (it) {
                return it.args.length === 0;
              })
              .map(function (field) {
                var isRequired = field.outputType.isRequired;
                return {
                  name: field.name,
                  type: helpers_1.getFieldTSType(field.outputType, modelNames),
                  hasExclamationToken: isRequired,
                  hasQuestionToken: !isRequired,
                  trailingTrivia: "\r\n",
                  decorators: [
                    {
                      name: "Field",
                      arguments: [
                        "_type => " +
                          helpers_1.getTypeGraphQLType(
                            field.outputType,
                            modelNames,
                          ),
                        "{\n                  nullable: " +
                          !isRequired +
                          ",\n                  description: undefined\n                }",
                      ],
                    },
                  ],
                };
              }),
            methods: fieldsInfo
              // TODO: allow also for other fields args
              .filter(function (it) {
                return it.args.length > 0 && type.name.startsWith("Aggregate");
              })
              .map(function (fieldInfo) {
                var isRequired = fieldInfo.outputType.isRequired;
                // TODO: make it more future-proof
                var collectionName = helpers_1.camelCase(
                  type.name.replace("Aggregate", ""),
                );
                return {
                  name: fieldInfo.name,
                  type: helpers_1.getFieldTSType(
                    fieldInfo.outputType,
                    modelNames,
                  ),
                  trailingTrivia: "\r\n",
                  decorators: [
                    {
                      name: "Field",
                      arguments: [
                        "_type => " +
                          helpers_1.getTypeGraphQLType(
                            fieldInfo.outputType,
                            modelNames,
                          ),
                        "{\n                  nullable: " +
                          !isRequired +
                          ",\n                  description: undefined\n                }",
                      ],
                    },
                  ],
                  parameters: [
                    {
                      name: "ctx",
                      // TODO: import custom `ContextType`
                      type: "any",
                      decorators: [{ name: "Context", arguments: [] }],
                    },
                    {
                      name: "args",
                      type: fieldInfo.argsTypeName,
                      decorators: [{ name: "Args", arguments: [] }],
                    },
                  ],
                  statements: [
                    "return ctx.prisma." +
                      collectionName +
                      "." +
                      fieldInfo.name +
                      "(args);",
                  ],
                };
              }),
          });
          return [4 /*yield*/, saveSourceFile_1["default"](sourceFile)];
        case 2:
          _a.sent();
          return [2 /*return*/, fieldArgsTypeNames];
      }
    });
  });
}
exports.generateOutputTypeClassFromType = generateOutputTypeClassFromType;
function generateInputTypeClassFromType(project, dirPath, type, modelNames) {
  return __awaiter(this, void 0, void 0, function () {
    var filePath, sourceFile;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          filePath = path_1["default"].resolve(
            dirPath,
            config_1.inputsFolderName,
            type.name + ".ts",
          );
          sourceFile = project.createSourceFile(filePath, undefined, {
            overwrite: true,
          });
          imports_1.generateTypeGraphQLImport(sourceFile);
          imports_1.generateInputsImports(
            sourceFile,
            type.fields
              .map(function (field) {
                return helpers_1.selectInputTypeFromTypes(field.inputType);
              })
              .filter(function (fieldType) {
                return fieldType.kind === "object";
              })
              .map(function (fieldType) {
                return fieldType.type;
              })
              .filter(function (fieldType) {
                return fieldType !== type.name;
              }),
          );
          imports_1.generateEnumsImports(
            sourceFile,
            type.fields
              .map(function (field) {
                return helpers_1.selectInputTypeFromTypes(field.inputType);
              })
              .filter(function (fieldType) {
                return fieldType.kind === "enum";
              })
              .map(function (fieldType) {
                return fieldType.type;
              }),
            2,
          );
          sourceFile.addClass({
            name: type.name,
            isExported: true,
            decorators: [
              {
                name: "InputType",
                arguments: [
                  "{\n            isAbstract: true,\n            description: undefined,\n          }",
                ],
              },
            ],
            properties: type.fields.map(function (field) {
              var inputType = helpers_1.selectInputTypeFromTypes(
                field.inputType,
              );
              return {
                name: field.name,
                type: helpers_1.getFieldTSType(inputType, modelNames),
                hasExclamationToken: inputType.isRequired,
                hasQuestionToken: !inputType.isRequired,
                trailingTrivia: "\r\n",
                decorators: [
                  {
                    name: "Field",
                    arguments: [
                      "_type => " +
                        helpers_1.getTypeGraphQLType(inputType, modelNames),
                      "{\n                  nullable: " +
                        !inputType.isRequired +
                        ",\n                  description: undefined\n                }",
                    ],
                  },
                ],
              };
            }),
          });
          return [4 /*yield*/, saveSourceFile_1["default"](sourceFile)];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
exports.generateInputTypeClassFromType = generateInputTypeClassFromType;
