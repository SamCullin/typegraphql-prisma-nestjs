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
import { User } from "../../../models/User";

@Resolver(_of => User)
export class CreateOneUserResolver {
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
}
