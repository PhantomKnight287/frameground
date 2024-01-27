import { Prisma } from "@prisma/client";
import {
  DynamicClientExtensionThis,
  InternalArgs,
} from "@prisma/client/runtime/library";
import { PrismaFindManyArgs } from "prisma-paginate/dist/prisma/PrismaFindManyArgs";
import { PrismaPaginateResult } from "prisma-paginate/dist/prisma/PrismaPaginateResult";
import { PrismaPaginationArgs } from "prisma-paginate/dist/prisma/PrismaPaginationArgs";

export type extendedPrismaClient =
  | DynamicClientExtensionThis<
      Prisma.TypeMap<
        InternalArgs & {
          result: {};
          model: {
            $allModels: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            account: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            session: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            user: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            verificationToken: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            track: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            challenge: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            solves: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            comment: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            upvote: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            report: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            solution: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
            file: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
                ): PrismaPaginateResult<Model, Args>;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: PrismaFindManyArgs<Model_1, Args_1>,
                  paginationArgs: PrismaPaginationArgs
                ): PrismaPaginateResult<Model_1, Args_1>;
              };
            };
          };
          query: {};
          client: {};
        }
      >,
      Prisma.TypeMapCb,
      {
        result: {};
        model: {
          $allModels: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          account: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          session: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          user: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          verificationToken: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          track: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          challenge: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          solves: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          comment: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          upvote: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          report: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          solution: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
          file: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
              ): PrismaPaginateResult<Model, Args>;
              <Model_1, Args_1>(
                this: Model_1,
                args: PrismaFindManyArgs<Model_1, Args_1>,
                paginationArgs: PrismaPaginationArgs
              ): PrismaPaginateResult<Model_1, Args_1>;
            };
          };
        };
        query: {};
        client: {};
      }
    >
  | undefined;
