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
import { User } from "../../../models/User";
import { AggregateUser } from "../../outputs/AggregateUser";

@Resolver(_of => User)
export class AggregateUserResolver {
  @Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined,
  })
  async aggregateUser(@Context() ctx: any): Promise<AggregateUser> {
    return new AggregateUser();
  }
}
