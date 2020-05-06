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
var helpers_1 = require("../helpers");
function generateCrudResolverClassMethodDeclaration(
  operationKind,
  actionName,
  method,
  argsTypeName,
  collectionName,
  modelNames,
  mapping,
  options,
) {
  var returnTSType = helpers_1.getFieldTSType(method.outputType, modelNames);
  return {
    name: options.useOriginalMapping
      ? method.name
      : helpers_1.getMappedActionName(actionName, method.name, mapping),
    isAsync: true,
    returnType: "Promise<" + returnTSType + ">",
    decorators: [
      {
        name: "" + operationKind,
        arguments: [
          "_returns => " +
            helpers_1.getTypeGraphQLType(method.outputType, modelNames),
          "{\n            nullable: " +
            !method.outputType.isRequired +
            ",\n            description: undefined\n          }",
        ],
      },
    ],
    parameters: __spreadArrays(
      [
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
    statements:
      actionName === "aggregate"
        ? [
            // it will expose field resolvers automatically
            "return new " + returnTSType + "();",
          ]
        : [
            "return ctx.prisma." +
              collectionName +
              "." +
              actionName +
              "(" +
              (argsTypeName ? "args" : "") +
              ");",
          ],
  };
}
exports.generateCrudResolverClassMethodDeclaration = generateCrudResolverClassMethodDeclaration;
