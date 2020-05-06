import { UserCrudResolver } from "./User/UserCrudResolver";
import { Module } from "@nestjs/common";

export { UserCrudResolver } from "./User/UserCrudResolver";
export { FindOneUserResolver } from "./User/FindOneUserResolver";
export { FindManyUserResolver } from "./User/FindManyUserResolver";
export { CreateOneUserResolver } from "./User/CreateOneUserResolver";
export { DeleteOneUserResolver } from "./User/DeleteOneUserResolver";
export { UpdateOneUserResolver } from "./User/UpdateOneUserResolver";
export { DeleteManyUserResolver } from "./User/DeleteManyUserResolver";
export { UpdateManyUserResolver } from "./User/UpdateManyUserResolver";
export { UpsertOneUserResolver } from "./User/UpsertOneUserResolver";
export { AggregateUserResolver } from "./User/AggregateUserResolver";
export * from "./User/args";

@Module({
  providers: [UserCrudResolver],
  exports: [UserCrudResolver],
})
export class CrudResolversModule {}
