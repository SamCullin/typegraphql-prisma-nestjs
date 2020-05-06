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
import { UpsertOneUserArgs } from "./args/UpsertOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class UpsertOneUserResolver {
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
}
