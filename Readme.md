# Example use NestJS + Prisma2 + Typegraphql
https://github.com/EndyKaufman/typegraphql-prisma-nestjs-example

![integration logo](https://raw.githubusercontent.com/EndyKaufman/typegraphql-prisma-nestjs/prisma/img/integration.png)

# TypeGraphQL & Prisma 2.0 integration

Prisma 2.0 generator to emit TypeGraphQL type classes and resolvers

## Installation

Fist of all, you have to install the generator, as a dev dependency:

```sh
npm i -D typegraphql-prisma-nestjs
```

`typegraphql-prisma` is designed to work only with selected version of `prisma`, so please install this version if you don't have it already installed:

```sh
npm i -D @prisma/cli@2.0.0-beta.2
npm i @prisma/client@2.0.0-beta.2
```

Also, be aware that due to usage of some newer Node.js features, you also have to use **Node.js v10.12 or newer**.

## Configuration

After installation, you need to update your `schema.prisma` file and add a new generator section below the `client` one:

```prisma
generator client {
  provider = "prisma-client-js"
}

generator typegraphql {
  provider = "node_modules/typegraphql-prisma-nestjs/generator.js"
}
```

Then after running `npx prisma generate`, this will emit the generated TypeGraphQL classes to `@generated/typegraphql-prisma-nestjs` in `node_modules` folder. You can also configure the default output folder, e.g.:

```prisma
generator typegraphql {
  provider = "node_modules/typegraphql-prisma-nestjs/generator.js"
  output   = "../prisma/generated/type-graphql"
}
```

## Usage

Given that you have this part of datamodel definitions:

```prisma
enum PostKind {
  BLOG
  ADVERT
}

model User {
  id    String  @default(cuid()) @id @unique
  email String  @unique
  name  String?
  posts Post[]
}
```

It will generate a `User` class in the output folder, with TypeGraphQL decorators, and an enum - you can import them and use normally as a type or an explicit type in your resolvers:

```ts
export enum PostKind {
  BLOG = "BLOG",
  ADVERT = "ADVERT",
}
TypeGraphQL.registerEnumType(PostKind, {
  name: "PostKind",
  description: undefined,
});

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  name?: string | null;

  posts?: Post[] | null;
}
```

It will also generates a whole bunch of stuffs based on your `schema.prisma` file - models classes, enums, as well as CRUD resolvers and relations resolver.

CRUD resolvers supports this following methods with args that are 1:1 matching with the `PrismaClient` API:

- findOne
- create
- update
- delete
- findMany
- updateMany
- deleteMany
- upsert

By default, the method names will be mapped to a GraphQL idiomatic ones (like `findManyUser` -> `users`).
You can opt-in to use original names by providing `useOriginalMapping = true` generator option.

Also, if you want to have relations like `User -> posts` emitted in schema, you need to import the relations resolvers and register them in your `buildSchema` call:

```ts
import {
  User,
  UserRelationsResolver,
  UserCrudResolver,
} from "@generated/type-graphql";

const schema = await buildSchema({
  resolvers: [CustomUserResolver, UserRelationsResolver, UserCrudResolver],
  validate: false,
});
```

When using the generated resolvers, you have to first provide the `PrismaClient` instance into the context under `prisma` key, to make it available for the crud and relations resolvers:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const server = new ApolloServer({
  schema,
  playground: true,
  context: (): Context => ({ prisma }),
});
```

### Nest JS

Due to difference between TypeGraphQL and NestJS decorators, `typegraphql-prisma` doesn't work well with Nest JS. In order to use generated resolvers, you need to use this fork:
https://github.com/EndyKaufman/typegraphql-prisma-nestjs

This is likely to change in the future - either by merging the fork back to this repository or by providing [more TypeGraphQL-ish integration for NestJS](https://github.com/MichalLytek/type-graphql/issues/135#issuecomment-474568922) that gonna work with standard TypeGraphQL constructs.

### Customization

You can also add custom queries and mutations to the schema as always, using the generated `PrismaClient` client:

```ts
@Resolver()
export class CustomUserResolver {
  @Query(returns => User, { nullable: true })
  async bestUser(@Ctx() { prisma }: Context): Promise<User | null> {
    return await prisma.user.findOne({
      where: { email: "bob@prisma.io" },
    });
  }
}
```

If you want to add a field to the generated type like `User`, you have to add a proper `@FieldResolver` for that:

```ts
@Resolver(of => User)
export class CustomUserResolver {
  @FieldResolver(type => Post, { nullable: true })
  async favoritePost(
    @Root() user: User,
    @Ctx() { prisma }: Context,
  ): Promise<Post | undefined> {
    const [favoritePost] = await prisma.user
      .findOne({ where: { id: user.id } })
      .posts({ first: 1 });

    return favoritePost;
  }
}
```

If you want to expose only certain Prisma actions, like `findManyUser` or `createOneUser`, you can import resolver classes only for them, instead of the whole model `CrudResolver`.
Then you just have to put them into the `buildSchema`:

```ts
import {
  User,
  UserRelationsResolver,
  FindManyUserResolver,
  CreateOneUserResolver,
} from "@generated/type-graphql";

const schema = await buildSchema({
  resolvers: [
    CustomUserResolver,
    UserRelationsResolver,
    FindManyUserResolver,
    CreateOneUserResolver,
  ],
  validate: false,
});
```

## Examples

You can check out some integration examples on this repo:

https://github.com/EndyKaufman/typegraphql-prisma-nestjs-example

## Feedback

Currently released version `0.1.x` is just a preview of the upcoming integration. For now it lacks customization option - picking/omitting fields of object types to expose in the schema, as well as picking CRUD methods and exposed args.

However, the base functionality is working well, so I strongly encourage you to give it a try and play with it. Any feedback about the developers experience, bug reports or ideas about new features or enhancements are very welcome - please feel free to put your two cents into [discussion in the issue](https://github.com/EndyKaufman/typegraphql-prisma-nestjs/issues/476).

In near feature, when Prisma SDK will be ready, the `typegraphql-prisma-nestjs` integration will also allow to use a code-first approach to build a `schema.prisma` and GraphQL schema at once, using classes with decorators as a single source of truth. Stay tuned! :muscle:
