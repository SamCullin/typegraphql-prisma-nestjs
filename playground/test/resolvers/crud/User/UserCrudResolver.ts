import {
  Args,
  ArgsType,
  Context,
  Field,
  Float,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  ResolveField,
  Resolver,
  Root,
  registerEnumType,
} from "@nestjs/graphql";
import { CreateOneUserArgs } from "./args/CreateOneUserArgs";
import { DeleteManyUserArgs } from "./args/DeleteManyUserArgs";
import { DeleteOneUserArgs } from "./args/DeleteOneUserArgs";
import { FindManyUserArgs } from "./args/FindManyUserArgs";
import { FindOneUserArgs } from "./args/FindOneUserArgs";
import { UpdateManyUserArgs } from "./args/UpdateManyUserArgs";
import { UpdateOneUserArgs } from "./args/UpdateOneUserArgs";
import { UpsertOneUserArgs } from "./args/UpsertOneUserArgs";
import { User } from "../../../models/User";
import { AggregateUser } from "../../outputs/AggregateUser";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => User)
export class UserCrudResolver {
  @Query(_returns => User, {
    nullable: true,
    description: undefined,
  })
  async user(
    @Context() ctx: any,
    @Args() args: FindOneUserArgs,
  ): Promise<User | null> {
    return ctx.prisma.user.findOne(args);
  }

  @Query(_returns => [User], {
    nullable: false,
    description: undefined,
  })
  async users(
    @Context() ctx: any,
    @Args() args: FindManyUserArgs,
  ): Promise<User[]> {
    return ctx.prisma.user.findMany(args);
  }

  @Mutation(_returns => User, {
    nullable: false,
    description: undefined,
  })
  async createOneUser(
    @Context() ctx: any,
    @Args() args: CreateOneUserArgs,
  ): Promise<User> {
    return ctx.prisma.user.create(args);
  }

  @Mutation(_returns => User, {
    nullable: true,
    description: undefined,
  })
  async deleteOneUser(
    @Context() ctx: any,
    @Args() args: DeleteOneUserArgs,
  ): Promise<User | null> {
    return ctx.prisma.user.delete(args);
  }

  @Mutation(_returns => User, {
    nullable: true,
    description: undefined,
  })
  async updateOneUser(
    @Context() ctx: any,
    @Args() args: UpdateOneUserArgs,
  ): Promise<User | null> {
    return ctx.prisma.user.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined,
  })
  async deleteManyUser(
    @Context() ctx: any,
    @Args() args: DeleteManyUserArgs,
  ): Promise<BatchPayload> {
    return ctx.prisma.user.deleteMany(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined,
  })
  async updateManyUser(
    @Context() ctx: any,
    @Args() args: UpdateManyUserArgs,
  ): Promise<BatchPayload> {
    return ctx.prisma.user.updateMany(args);
  }

  @Mutation(_returns => User, {
    nullable: false,
    description: undefined,
  })
  async upsertOneUser(
    @Context() ctx: any,
    @Args() args: UpsertOneUserArgs,
  ): Promise<User> {
    return ctx.prisma.user.upsert(args);
  }

  @Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined,
  })
  async aggregateUser(@Context() ctx: any): Promise<AggregateUser> {
    return new AggregateUser();
  }
}
