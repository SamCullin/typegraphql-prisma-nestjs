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

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class BatchPayload {
  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  count!: number;
}
