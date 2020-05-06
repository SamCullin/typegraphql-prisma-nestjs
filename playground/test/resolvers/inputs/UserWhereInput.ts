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
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { NullableStringFilter } from "../inputs/NullableStringFilter";
import { StringFilter } from "../inputs/StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserWhereInput {
  @Field(_type => IntFilter, {
    nullable: true,
    description: undefined,
  })
  intIdField?: IntFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined,
  })
  uniqueStringField?: StringFilter | null;

  @Field(_type => NullableStringFilter, {
    nullable: true,
    description: undefined,
  })
  optionalStringField?: NullableStringFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined,
  })
  dateField?: DateTimeFilter | null;

  @Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined,
  })
  AND?: UserWhereInput[] | null;

  @Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined,
  })
  OR?: UserWhereInput[] | null;

  @Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined,
  })
  NOT?: UserWhereInput[] | null;
}
