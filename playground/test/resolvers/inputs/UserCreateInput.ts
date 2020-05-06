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
export class UserCreateInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  uniqueStringField!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  optionalStringField?: string | null;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  dateField!: Date;
}
