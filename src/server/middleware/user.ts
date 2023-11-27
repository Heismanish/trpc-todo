import { TRPCError, initTRPC } from "@trpc/server";
import { middleware } from "../trpc";

export const isLoggedIn = middleware(async (opts) => {
  const { ctx } = opts;

  console.log("middlware reached");
  if (!ctx.userId) {
    console.log("middlware error");

    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  let user = await ctx.db.User.findOne({ userId: ctx.userId });
  console.log("middlware is fine");
  console.log(user);
  return opts.next({
    ctx: { user },
  });
});
