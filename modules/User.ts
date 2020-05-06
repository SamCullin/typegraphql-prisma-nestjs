@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  intIdField!: number;

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
