import "reflect-metadata";
import {
  ObjectType,
  Field,
  MissingClassMetadataError,
  MissingFieldsError,
} from "@typegraphql/core";

import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("Object types > errors", () => {
  it("should throw an error if an undecorated class is provided to buildSchema", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: string;
    }
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleObject, UnknownClass],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingClassMetadataError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find metadata for class 'UnknownClass' in storage. Is it annotated with the '@ObjectType' decorator?"`,
      );
    }
  });

  it("should throw an error if the object type has no fields registered", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      sampleField!: string;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingFieldsError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find any fields metadata for type class 'SampleObject' in storage. Are the properties annotated with a '@Field()' decorator?"`,
      );
    }
  });
});