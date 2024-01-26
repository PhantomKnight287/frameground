export type extendedPrismaClient =
  | import("@prisma/client/runtime/library").DynamicClientExtensionThis<
      import("@prisma/client").Prisma.TypeMap<
        import("@prisma/client/runtime/library").InternalArgs & {
          result: {};
          model: {
            $allModels: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            account: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            session: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            user: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            verificationToken: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            track: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            challenge: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            solves: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            comment: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
            upvote: {
              paginate: () => {
                <Model, Args>(
                  this: Model,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model,
                    Args
                  > &
                    import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model,
                  Args
                >;
                <Model_1, Args_1>(
                  this: Model_1,
                  args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                    Model_1,
                    Args_1
                  >,
                  paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
                ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                  Model_1,
                  Args_1
                >;
              };
            };
          };
          query: {};
          client: {};
        }
      >,
      import("@prisma/client").Prisma.TypeMapCb,
      {
        result: {};
        model: {
          $allModels: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          account: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          session: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          user: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          verificationToken: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          track: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          challenge: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          solves: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          comment: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
          upvote: {
            paginate: () => {
              <Model, Args>(
                this: Model,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model,
                  Args
                > &
                  import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model,
                Args
              >;
              <Model_1, Args_1>(
                this: Model_1,
                args: import("prisma-paginate/dist/prisma/PrismaFindManyArgs").PrismaFindManyArgs<
                  Model_1,
                  Args_1
                >,
                paginationArgs: import("prisma-paginate/dist/prisma/PrismaPaginationArgs").PrismaPaginationArgs
              ): import("prisma-paginate/dist/prisma/PrismaPaginateResult").PrismaPaginateResult<
                Model_1,
                Args_1
              >;
            };
          };
        };
        query: {};
        client: {};
      }
    >
  | undefined;
