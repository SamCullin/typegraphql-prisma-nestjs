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
import { UpdateOneUserArgs } from "./args/UpdateOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class UpdateOneUserResolver {
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
}
