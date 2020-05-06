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
import { FindManyUserArgs } from "./args/FindManyUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class FindManyUserResolver {
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
}
