import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { Todo, User } from "@/models";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const connectToMongoDB = async () => {
  console.log(process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017");
};

// const createContext = async (req: Request) => {
//   await connectToMongoDB();

//   const db = {
//     Todo: mongoose.model("Todo"),
//     User: mongoose.model("User"),
//   };

//   const token = req.headers.authorization?.split("Bearer ")[1];
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = decoded.sub;
//       return { db, userId };
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   return { db };
// };

const handler = async (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (opts) => {
      await connectToMongoDB();
      console.log("ajbk");

      const db = {
        Todo: mongoose.model("Todo"),
        User: mongoose.model("User"),
      };
      const authorization = req.headers.get("authorization");
      const token = authorization?.split("Bearer ")[1];
      console.log("ajbk");
      if (token) {
        return new Promise<{
          db: { Todo: typeof Todo; User: typeof User };
          userId?: string;
        }>((resolve) => {
          jwt.verify(token, process.env.SECRET || "", (err, user) => {
            if (user) {
              console.log(user);
              const userId = (user as { userId: string }).userId; // Type assertion
              console.log(userId);
              resolve({ userId, db: { Todo, User } });
            } else {
              resolve({ db: { Todo, User } });
            }
          });
        });
      }

      return { db: { Todo, User } };
    },
  });

export { handler as GET, handler as POST };
