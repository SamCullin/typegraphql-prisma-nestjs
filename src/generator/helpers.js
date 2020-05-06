"use strict";
exports.__esModule = true;
function noop() {}
exports.noop = noop;
function getBaseModelTypeName(modelName) {
  // TODO: add proper support for swapping model types with custom types
  // return `Base${modelName}`;
  return modelName;
}
exports.getBaseModelTypeName = getBaseModelTypeName;
function getFieldTSType(typeInfo, modelNames) {
  var TSType;
  if (typeInfo.kind === "scalar") {
    TSType = mapScalarToTSType(typeInfo.type);
  } else if (typeInfo.kind === "object") {
    if (modelNames.includes(typeInfo.type)) {
      TSType = getBaseModelTypeName(typeInfo.type);
    } else {
      TSType = typeInfo.type;
    }
  } else if (typeInfo.kind === "enum") {
    TSType = "keyof typeof " + typeInfo.type;
  } else {
    throw new Error("Unsupported field type kind: " + typeInfo.kind);
  }
  if (typeInfo.isList) {
    if (TSType.includes(" ")) {
      TSType = "Array<" + TSType + ">";
    } else {
      TSType += "[]";
    }
  }
  if (!typeInfo.isRequired) {
    TSType += " | null";
  }
  return TSType;
}
exports.getFieldTSType = getFieldTSType;
function mapScalarToTSType(scalar) {
  switch (scalar) {
    case "ID":
    case "UUID": {
      return "string";
    }
    case "String": {
      return "string";
    }
    case "Boolean": {
      return "boolean";
    }
    case "DateTime": {
      return "Date";
    }
    case "Int":
    case "Float": {
      return "number";
    }
    default:
      throw new Error("Unrecognized scalar type: " + scalar);
  }
}
exports.mapScalarToTSType = mapScalarToTSType;
function getTypeGraphQLType(typeInfo, modelNames) {
  var GraphQLType;
  if (typeInfo.kind === "scalar") {
    GraphQLType = mapScalarToTypeGraphQLType(typeInfo.type);
  } else if (typeInfo.kind === "object") {
    if (modelNames.includes(typeInfo.type)) {
      GraphQLType = getBaseModelTypeName(typeInfo.type);
    } else {
      GraphQLType = typeInfo.type;
    }
  } else {
    GraphQLType = typeInfo.type;
  }
  if (typeInfo.isList) {
    GraphQLType = "[" + GraphQLType + "]";
  }
  return GraphQLType;
}
exports.getTypeGraphQLType = getTypeGraphQLType;
function mapScalarToTypeGraphQLType(scalar) {
  switch (scalar) {
    case "DateTime": {
      return "Date";
    }
    // TODO: use proper uuid graphql scalar
    case "UUID": {
      return "String";
    }
    case "Boolean":
    case "String": {
      return scalar;
    }
    case "ID":
    case "Int":
    case "Float": {
      return "" + scalar;
    }
    default: {
      throw new Error("Unrecognized scalar type: " + scalar);
    }
  }
}
exports.mapScalarToTypeGraphQLType = mapScalarToTypeGraphQLType;
function selectInputTypeFromTypes(inputTypes) {
  return (
    inputTypes.find(function (it) {
      return it.kind === "object";
    }) ||
    inputTypes.find(function (it) {
      return it.kind === "enum";
    }) ||
    inputTypes[0]
  );
}
exports.selectInputTypeFromTypes = selectInputTypeFromTypes;
function camelCase(str) {
  return str[0].toLowerCase() + str.slice(1);
}
exports.camelCase = camelCase;
function pascalCase(str) {
  return str[0].toUpperCase() + str.slice(1);
}
exports.pascalCase = pascalCase;
function getMappedActionName(actionName, methodName, mapping) {
  switch (actionName) {
    case "findOne": {
      return camelCase(mapping.model);
    }
    case "findMany": {
      return camelCase(mapping.plural);
    }
    default: {
      return methodName;
    }
  }
}
exports.getMappedActionName = getMappedActionName;
var attributeRegex = /(@@TypeGraphQL\.)+([A-z])+(\(")+([A-z])+("\))+/;
var attributeArgsRegex = /(?:\(")+([A-Za-z])+(?:"\))+/;
var attributeKindRegex = /(?:\.)+([A-Za-z])+(?:\()+/;
function parseDocumentationAttributes(documentation, expectedAttributeKind) {
  var _a, _b, _c, _d, _e;
  var attribute =
    (_a =
      documentation === null || documentation === void 0
        ? void 0
        : documentation.match(attributeRegex)) === null || _a === void 0
      ? void 0
      : _a[0];
  var attributeKind =
    (_c =
      (_b =
        attribute === null || attribute === void 0
          ? void 0
          : attribute.match(attributeKindRegex)) === null || _b === void 0
        ? void 0
        : _b[0]) === null || _c === void 0
      ? void 0
      : _c.slice(1, -1);
  if (attributeKind !== expectedAttributeKind) {
    return;
  }
  var attributeArgs =
    (_e =
      (_d =
        attribute === null || attribute === void 0
          ? void 0
          : attribute.match(attributeArgsRegex)) === null || _d === void 0
        ? void 0
        : _d[0]) === null || _e === void 0
      ? void 0
      : _e.slice(1, -1);
  return attributeArgs;
}
exports.parseDocumentationAttributes = parseDocumentationAttributes;
