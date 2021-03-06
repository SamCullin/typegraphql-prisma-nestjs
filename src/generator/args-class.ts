import { PropertyDeclarationStructure, OptionalKind, Project } from "ts-morph";
import { DMMF } from "@prisma/client/runtime/dmmf-types";
import path from "path";

import {
  getFieldTSType,
  getTypeGraphQLType,
  pascalCase,
  selectInputTypeFromTypes,
} from "./helpers";
import { DMMFTypeInfo } from "./types";
import { argsFolderName } from "./config";
import {
  generateTypeGraphQLImport,
  generateInputsImports,
  generateEnumsImports,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";

export default async function generateArgsTypeClassFromArgs(
  project: Project,
  generateDirPath: string,
  args: DMMF.SchemaArg[],
  methodName: string,
  modelNames: string[],
  inputImportsLevel = 3,
) {
  const name = `${pascalCase(methodName)}Args`;

  const dirPath = path.resolve(generateDirPath, argsFolderName);
  const filePath = path.resolve(dirPath, `${name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateInputsImports(
    sourceFile,
    args
      .map(arg => selectInputTypeFromTypes(arg.inputType))
      .filter(argType => argType.kind === "object")
      .map(argType => argType.type as string),
    inputImportsLevel,
  );
  generateEnumsImports(
    sourceFile,
    args
      .map(field => selectInputTypeFromTypes(field.inputType))
      .filter(argType => argType.kind === "enum")
      .map(argType => argType.type as string),
    3,
  );

  sourceFile.addClass({
    name,
    isExported: true,
    decorators: [
      {
        name: "ArgsType",
        arguments: [],
      },
    ],
    properties: args.map<OptionalKind<PropertyDeclarationStructure>>(arg => {
      const inputType = selectInputTypeFromTypes(arg.inputType);
      const isOptional = !inputType.isRequired;

      return {
        name: arg.name,
        type: getFieldTSType(inputType as DMMFTypeInfo, modelNames),
        hasExclamationToken: !isOptional,
        hasQuestionToken: isOptional,
        trailingTrivia: "\r\n",
        decorators: [
          {
            name: "Field",
            arguments: [
              `_type => ${getTypeGraphQLType(
                inputType as DMMFTypeInfo,
                modelNames,
              )}`,
              `{ nullable: ${isOptional} }`,
            ],
          },
        ],
      };
    }),
  });

  await saveSourceFile(sourceFile);
  return name;
}
