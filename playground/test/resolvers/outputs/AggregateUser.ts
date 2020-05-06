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
import { AggregateUserCountArgs } from "./args/AggregateUserCountArgs";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateUser {
  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  count(@Context() ctx: any, @Args() args: AggregateUserCountArgs) {
    return ctx.prisma.user.count(args);
  }
}
