import { todoRouter } from "./routes/todo";
import { userRouter } from "./routes/user";
import { publicProcedure, router } from "./trpc";

// export const appRouter = router({
//   todos: publicProcedure.query(() => {
//     console.log("ajbk");

//     return [1, 2, 4, 3, 5];
//   }),
// });

export const appRouter = router({
  user: userRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
