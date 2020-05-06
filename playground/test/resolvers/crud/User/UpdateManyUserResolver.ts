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
import { UpdateManyUserArgs } from "./args/UpdateManyUserArgs";
import { User } from "../../../models/User";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => User)
export class UpdateManyUserResolver {
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
}
