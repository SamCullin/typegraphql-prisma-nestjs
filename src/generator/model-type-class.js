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
var helpers_1 = require("./helpers");
var imports_1 = require("./imports");
var config_1 = require("./config");
var saveSourceFile_1 = require("../utils/saveSourceFile");
function generateObjectTypeClassFromModel(
  project,
  baseDirPath,
  model,
  modelNames,
) {
  return __awaiter(this, void 0, void 0, function () {
    var dirPath, filePath, sourceFile, modelDocs, attributeArgs, typeName;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          dirPath = path_1["default"].resolve(
            baseDirPath,
            config_1.modelsFolderName,
          );
          filePath = path_1["default"].resolve(dirPath, model.name + ".ts");
          sourceFile = project.createSourceFile(filePath, undefined, {
            overwrite: true,
          });
          imports_1.generateTypeGraphQLImport(sourceFile);
          imports_1.generateModelsImports(
            sourceFile,
            model.fields
              .filter(function (field) {
                return field.kind === "object";
              })
              .filter(function (field) {
                return field.type !== model.name;
              })
              .map(function (field) {
                return field.type;
              }),
          );
          imports_1.generateEnumsImports(
            sourceFile,
            model.fields
              .filter(function (field) {
                return field.kind === "enum";
              })
              .map(function (field) {
                return field.type;
              }),
          );
          modelDocs = undefined;
          attributeArgs = helpers_1.parseDocumentationAttributes(
            model.documentation,
            "type",
          );
          typeName =
            attributeArgs === null || attributeArgs === void 0
              ? void 0
              : attributeArgs.slice(1, -1);
          console.log(model.name, typeName);
          sourceFile.addClass(
            __assign(
              {
                name: helpers_1.getBaseModelTypeName(model.name),
                isExported: true,
                decorators: [
                  {
                    name: "ObjectType",
                    arguments: [
                      // `"${model.name}"`,
                      // `"${getBaseModelTypeName(model.name)}"`,
                      "{\n            isAbstract: true,\n            description: " +
                        (modelDocs ? '"' + modelDocs + '"' : "undefined") +
                        ",\n          }",
                    ],
                  },
                ],
                properties: model.fields.map(function (field) {
                  var isOptional = !!field.relationName || !field.isRequired;
                  // FIXME: restore when issue fixed: https://github.com/prisma/prisma2/issues/1987
                  var fieldDocs = undefined;
                  // const fieldDocs =
                  //   field.documentation && field.documentation.replace("\r", "");
                  return __assign(
                    {
                      name: field.name,
                      type: helpers_1.getFieldTSType(field, modelNames),
                      hasExclamationToken: !isOptional,
                      hasQuestionToken: isOptional,
                      trailingTrivia: "\r\n",
                      decorators: __spreadArrays(
                        field.relationName
                          ? []
                          : [
                              {
                                name: "Field",
                                arguments: [
                                  "_type => " +
                                    helpers_1.getTypeGraphQLType(
                                      field,
                                      modelNames,
                                    ),
                                  "{\n                        nullable: " +
                                    isOptional +
                                    ",\n                        description: " +
                                    (fieldDocs
                                      ? '"' + fieldDocs + '"'
                                      : "undefined") +
                                    ",\n                      }",
                                ],
                              },
                            ],
                      ),
                    },
                    fieldDocs && {
                      docs: [{ description: fieldDocs }],
                    },
                  );
                }),
              },
              modelDocs && {
                docs: [{ description: modelDocs }],
              },
            ),
          );
          return [4 /*yield*/, saveSourceFile_1["default"](sourceFile)];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
exports["default"] = generateObjectTypeClassFromModel;
