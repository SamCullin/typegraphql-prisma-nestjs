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
import { DeleteManyUserArgs } from "./args/DeleteManyUserArgs";
import { User } from "../../../models/User";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => User)
export class DeleteManyUserResolver {
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
}
