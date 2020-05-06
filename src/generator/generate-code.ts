import { DMMF } from "@prisma/client/runtime/dmmf-types";
import { Project } from "ts-morph";
import path from "path";

import { noop } from "./helpers";
import generateEnumFromDef from "./enum";
import generateObjectTypeClassFromModel from "./model-type-class";
import generateRelationsResolverClassesFromModel from "./resolvers/relations";
import {
  generateOutputTypeClassFromType,
  generateInputTypeClassFromType,
} from "./type-class";
import generateCrudResolverClassFromMapping from "./resolvers/full-crud";
import {
  resolversFolderName,
  relationsResolversFolderName,
  crudResolversFolderName,
  inputsFolderName,
  outputsFolderName,
  enumsFolderName,
  modelsFolderName,
  argsFolderName,
} from "./config";
import {
  generateResolversBarrelFile,
  generateInputsBarrelFile,
  generateOutputsBarrelFile,
  generateIndexFile,
  generateModelsBarrelFile,
  generateEnumsBarrelFile,
  generateArgsBarrelFile,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";
import { GenerateCodeOptions } from "./options";

export const defaultHooks = {
  generateEnumFromDef: generateEnumFromDef,
  generateEnumsBarrelFile: generateEnumsBarrelFile,
  generateObjectTypeClassFromModel: generateObjectTypeClassFromModel,
  generateModelsBarrelFile: generateModelsBarrelFile,
  generateOutputTypeClassFromType: generateOutputTypeClassFromType,
  generateArgsBarrelFile: generateArgsBarrelFile,
  generateOutputsBarrelFile: generateOutputsBarrelFile,
  generateInputTypeClassFromType: generateInputTypeClassFromType,
  generateInputsBarrelFile: generateInputsBarrelFile,
  generateRelationsResolverClassesFromModel: generateRelationsResolverClassesFromModel,
  generateResolversBarrelFile: generateResolversBarrelFile,
  generateCrudResolverClassFromMapping: generateCrudResolverClassFromMapping,
  generateIndexFile: generateIndexFile,
};

export default async function generateCode(
  dmmf: DMMF.Document,
  options: GenerateCodeOptions,
  hook = defaultHooks,
  log: (msg: string) => void = noop,
) {
  const baseDirPath = options.outputDirPath;
  const project = new Project();
  const resolversDirPath = path.resolve(baseDirPath, resolversFolderName);
  const modelNames = dmmf.datamodel.models.map(model => model.name);

  log("Generating enums...");
  const datamodelEnumNames = dmmf.datamodel.enums.map(enumDef => enumDef.name);
  await Promise.all(
    dmmf.datamodel.enums.map(enumDef =>
      hook.generateEnumFromDef(project, baseDirPath, enumDef),
    ),
  );
  await Promise.all(
    dmmf.schema.enums
      // skip enums from datamodel
      .filter(enumDef => !datamodelEnumNames.includes(enumDef.name))
      .map(enumDef => hook.generateEnumFromDef(project, baseDirPath, enumDef)),
  );
  const emittedEnumNames = [
    ...new Set([
      ...dmmf.schema.enums.map(it => it.name),
      ...dmmf.datamodel.enums.map(it => it.name),
    ]),
  ];
  const enumsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(baseDirPath, enumsFolderName, "index.ts"),
    undefined,
    { overwrite: true },
  );
  hook.generateEnumsBarrelFile(enumsBarrelExportSourceFile, emittedEnumNames);
  await saveSourceFile(enumsBarrelExportSourceFile);

  log("Generating models...");
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      hook.generateObjectTypeClassFromModel(
        project,
        baseDirPath,
        model,
        modelNames,
      ),
    ),
  );
  const modelsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(baseDirPath, modelsFolderName, "index.ts"),
    undefined,
    { overwrite: true },
  );
  hook.generateModelsBarrelFile(
    modelsBarrelExportSourceFile,
    dmmf.datamodel.models.map(it => it.name),
  );
  await saveSourceFile(modelsBarrelExportSourceFile);

  log("Generating output types...");
  const rootTypes = dmmf.schema.outputTypes.filter(type =>
    ["Query", "Mutation"].includes(type.name),
  );
  const outputTypesToGenerate = dmmf.schema.outputTypes.filter(
    // skip generating models and root resolvers
    type => !modelNames.includes(type.name) && !rootTypes.includes(type),
  );
  const argsTypesNamesArray = await Promise.all(
    outputTypesToGenerate.map(type =>
      hook.generateOutputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        modelNames,
      ),
    ),
  );
  const argsTypesNames = argsTypesNamesArray.reduce((a, b) => a.concat(b), []);
  const outputsArgsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      outputsFolderName,
      argsFolderName,
      "index.ts",
    ),
    undefined,
    { overwrite: true },
  );
  hook.generateArgsBarrelFile(
    outputsArgsBarrelExportSourceFile,
    argsTypesNames,
  );
  await saveSourceFile(outputsArgsBarrelExportSourceFile);

  const outputsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      outputsFolderName,
      "index.ts",
    ),
    undefined,
    { overwrite: true },
  );
  hook.generateOutputsBarrelFile(
    outputsBarrelExportSourceFile,
    outputTypesToGenerate.map(it => it.name),
    argsTypesNames.length > 0,
  );
  await saveSourceFile(outputsBarrelExportSourceFile);

  log("Generating input types...");
  await Promise.all(
    dmmf.schema.inputTypes.map(type =>
      hook.generateInputTypeClassFromType(
        project,
        resolversDirPath,
        type,
        modelNames,
      ),
    ),
  );
  const inputsBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      inputsFolderName,
      "index.ts",
    ),
    undefined,
    { overwrite: true },
  );
  hook.generateInputsBarrelFile(
    inputsBarrelExportSourceFile,
    dmmf.schema.inputTypes.map(it => it.name),
  );
  await saveSourceFile(inputsBarrelExportSourceFile);

  log("Generating relation resolvers...");
  const relationResolversData = await Promise.all(
    dmmf.datamodel.models
      .filter(model => model.fields.some(field => field.relationName))
      .map(model => {
        const outputType = dmmf.schema.outputTypes.find(
          type => type.name === model.name,
        )!;
        const mapping = dmmf.mappings.find(it => it.model === model.name)!;
        return hook.generateRelationsResolverClassesFromModel(
          project,
          baseDirPath,
          model,
          mapping,
          outputType,
          modelNames,
        );
      }),
  );
  if (relationResolversData.length > 0) {
    const relationResolversBarrelExportSourceFile = project.createSourceFile(
      path.resolve(
        baseDirPath,
        resolversFolderName,
        relationsResolversFolderName,
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
    await saveSourceFile(relationResolversBarrelExportSourceFile);
  }

  log("Generating crud resolvers...");
  const crudResolversData = await Promise.all(
    dmmf.mappings.map(mapping => {
      const model = dmmf.datamodel.models.find(
        model => model.name === mapping.model,
      )!;
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
  );
  const crudResolversBarrelExportSourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      crudResolversFolderName,
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
  await saveSourceFile(crudResolversBarrelExportSourceFile);

  log("Generating index file");
  const indexSourceFile = project.createSourceFile(
    baseDirPath + "/index.ts",
    undefined,
    { overwrite: true },
  );
  hook.generateIndexFile(indexSourceFile, relationResolversData.length > 0);
  await saveSourceFile(indexSourceFile);
}
