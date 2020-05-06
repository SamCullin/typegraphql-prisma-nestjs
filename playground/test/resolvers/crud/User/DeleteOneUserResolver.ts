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
import { DeleteOneUserArgs } from "./args/DeleteOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class DeleteOneUserResolver {
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
}
