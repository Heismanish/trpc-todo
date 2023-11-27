import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middleware/user";
import { TRPCError } from "@trpc/server";

interface todoType {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const todoRouter = router({
  createTodo: publicProcedure
    .use(isLoggedIn)
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async (opts) => {
      const title = opts.input.title;
      const description = opts.input.description;

      const userId = opts.ctx.userId;
      console.log(userId, title, description);

      const newTodo = new opts.ctx.db.Todo({
        title,
        description,
        completed: false,
        userId,
      });
      await newTodo.save();
      console.log(newTodo);
      return { id: newTodo._id };
    }),
  allTodos: publicProcedure
    .use(isLoggedIn)
    .output(
      z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          completed: z.boolean(),
        })
      )
    )
    .query(async (opts) => {
      const userId = opts.ctx.userId;
      const todos = await opts.ctx.db.Todo.find({ userId });
      console.log(todos);

      return todos.map((todo: todoType) => ({
        id: todo._id.toString(),
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      }));
    }),
  todoCompleted: publicProcedure
    .use(isLoggedIn)
    .input(z.object({ todoId: z.string() }))
    .mutation(async (opts) => {
      // const userId = opts.ctx.userId;
      const todoId = opts.input.todoId;
      // let completed = false;
      const completedTodo = await opts.ctx.db.Todo.findByIdAndUpdate(todoId, {
        completed: true,
      });
      if (!completedTodo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      console.log(completedTodo);
      return { completed: completedTodo.completed };
    }),
  deleteTodo: publicProcedure
    .use(isLoggedIn)
    .input(z.object({ todoId: z.string() }))
    .mutation(async (opts) => {
      const todoId = opts.input.todoId;

      const deletedTodo = await opts.ctx.db.Todo.findByIdAndDelete(todoId);

      if (!deletedTodo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      console.log(deletedTodo);
      return { deleted: true };
    }),
});
