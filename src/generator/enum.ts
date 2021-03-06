import { EnumMemberStructure, OptionalKind, Project } from "ts-morph";
import { DMMF } from "@prisma/client/runtime/dmmf-types";
import path from "path";

import { generateTypeGraphQLImport } from "./imports";
import { enumsFolderName } from "./config";
import saveSourceFile from "../utils/saveSourceFile";

export default async function generateEnumFromDef(
  project: Project,
  baseDirPath: string,
  enumDef: DMMF.Enum,
) {
  const dirPath = path.resolve(baseDirPath, enumsFolderName);
  const filePath = path.resolve(dirPath, `${enumDef.name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });
  generateTypeGraphQLImport(sourceFile);

  // FIXME: remove when issue fixed: https://github.com/prisma/prisma2/issues/1987
  const documentation = undefined as string | undefined;
  // const documentation =
  //   enumDef.documentation && enumDef.documentation.split("\\r")[0].slice(2);
  sourceFile.addEnum({
    isExported: true,
    name: enumDef.name,
    ...(documentation && {
      docs: [{ description: documentation }],
    }),
    members: enumDef.values.map<OptionalKind<EnumMemberStructure>>(
      enumValue => ({
        name: enumValue,
        value: enumValue,
        // TODO: add support for string enums (values)
        // TODO: add support for enum members docs
      }),
    ),
  });

  // TODO: refactor to AST
  sourceFile.addStatements([
    `registerEnumType(${enumDef.name}, {
      name: "${enumDef.name}",
      description: ${documentation ? `"${documentation}"` : "undefined"},
    });`,
  ]);

  await saveSourceFile(sourceFile);
}
