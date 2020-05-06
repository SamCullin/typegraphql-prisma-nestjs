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

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserWhereUniqueInput {
  @Field(_type => Int, {
    nullable: true,
    description: undefined,
  })
  intIdField?: number | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  uniqueStringField?: string | null;
}
