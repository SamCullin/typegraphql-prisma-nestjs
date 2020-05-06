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
import { FindOneUserArgs } from "./args/FindOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class FindOneUserResolver {
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
}
