import { initTRPC } from "@trpc/server";
import { appRouter } from ".";
import { User, Todo } from "@/models";

const t = initTRPC
  .context<{ db: { Todo: typeof Todo; User: typeof User }; userId?: string }>()
  .create();

export const SECRET = process.env.SECRET || "ilupilu";
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
