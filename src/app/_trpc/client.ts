import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { type AppRouter } from "@/server";

// Create the TRPC client with the custom fetch function
export const trpc = createTRPCReact<AppRouter>({});
