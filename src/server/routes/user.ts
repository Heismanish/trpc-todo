import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "../middleware/user";
import { router, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { SECRET } from "../trpc";

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({ name: z.string(), password: z.string(), email: z.string() })
    )
    .mutation(async (opts) => {
      const name = opts.input.name;
      const password = opts.input.password;
      const email = opts.input.email;

      const hashedPassword = await bcryptjs.hash(password, 10);
      const existingUser = await opts.ctx.db.User.findOne({
        email,
      });
      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT" });
      }
      const newUser = await opts.ctx.db.User.insertMany({
        name,
        password: hashedPassword,
        email,
      });
      console.log(newUser);
      const userId = newUser[0]._id;
      const token = jwt.sign({ userId }, SECRET, { expiresIn: "1h" });
      console.log(userId);
      console.log(token);
      return { token };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async (opts) => {
      const user = await opts.ctx.db.User.findOne({
        email: opts.input.email,
      });
      console.log("reached login");
      // Validating User
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Validating password
      const isPasswordValid = await bcryptjs.compare(
        opts.input.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      console.log(user);
      const userId = user._id;

      const token = jwt.sign({ userId }, SECRET, {
        expiresIn: "1h",
      });

      console.log(token);

      return { token };
    }),
  me: publicProcedure
    .use(isLoggedIn)
    .output(
      z.object({
        name: z.string(),
      })
    )
    .query(async (opts) => {
      console.log("USer me ");

      // Perform a null check on opts.ctx.userId
      // const userId = opts.ctx.userId ? opts.ctx.userId.toString() : null;
      console.log("USer me 1");

      const user = await opts.ctx.db.User.findById(opts.ctx.userId);

      console.log("USer me 2");
      console.log(user);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // await user.populate("todoRef");
      console.log(user);

      const { name } = user;
      // const todos: todoType[] = todoRef.map((todo: todoType) => ({
      //   title: todo.title,
      //   description: todo.description,
      //   completed: todo.completed,
      // }));
      // console.log(todos);

      return {
        name,
        // todos,
        // todos: todoRef.map((todo: todoType) => ({
        //   title: todo.title,
        //   description: todo.description,
        //   completed: todo.completed,
        // })),
      };
    }),
});
