import { DMMF } from "@prisma/client/runtime/dmmf-types";
import { GetDMMFOptions } from "@prisma/sdk";
const PrismaClientGeneratorBuild = require("@prisma/client/generator-build");
import { PropertyDeclarationStructure, OptionalKind, Project } from "ts-morph";

import generateCode, { defaultHooks } from "../src/generator/generate-code";

import path from "path";

const schema = /* prisma */ `
model User {
  intIdField          Int     @id @default(autoincrement())
  uniqueStringField   String  @unique
  optionalStringField String?
  dateField           DateTime
}
`;

export interface GenerateCodeOptions {
  outputDirPath: string;
  emitDMMF?: boolean;
  useOriginalMapping?: boolean;
}

function getDMMF(options: GetDMMFOptions): Promise<DMMF.Document> {
  return PrismaClientGeneratorBuild.getDMMF(options);
}

export interface DMMFTypeInfo {
  // type: string | OutputType | Enum;
  type: string;
  isList: boolean;
  isRequired: boolean;
  kind: DMMF.FieldKind;
}

export async function getPrismaClientDmmfFromPrismaSchema(
  prismaSchema: string,
): Promise<DMMF.Document> {
  return await getDMMF({ datamodel: prismaSchema });
}
export interface GenerateCodeOptions {
  outputDirPath: string;
  emitDMMF?: boolean;
  useOriginalMapping?: boolean;
}
const overridedGenerator = async (
  project: Project,
  baseDirPath: string,
  enumDef: DMMF.Enum,
) => {
  console.log("Override Hook Called");
};

getPrismaClientDmmfFromPrismaSchema(schema)
  .then(async dmmf => {
    await generateCode(
      dmmf,
      {
        outputDirPath: path.resolve("./test"),
      },
      {
        ...defaultHooks,
        generateEnumFromDef: overridedGenerator,
      },
    );
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  })
  .finally(() => {
    console.log("DONE!");
    process.exit();
  });
