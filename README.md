Steps to setup:

1. Install neccessary dependencies.

```shell
yarn add @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query@^4.0.0 zod
```

2. Setting up the trpc route:

   - create `api/trpc/[trpc]/route.ts` and define the route in the file as:

   ```typescript
   import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
   import { appRouter } from "@/server";
   const handler = (req: Request) =>
     fetchRequestHandler({
       endpoint: "/api/trpc",
       req,
       router: appRouter,
       createContext: () => ({}),
     });

   export { handler as GET, handler as POST };
   ```

3. setting up the trpc server in `app/server/trpc.ts` as follows:

   ```typescript
   import { initTRPC } from "@trpc/server";

   const t = initTRPC.create();

   export const router = t.router;
   export const middleware = t.middleware;
   export const publicProcedure = t.procedure;
   ```

4. create appRouter and export it in `app/server/index.ts`:

   ```typescript
   import { publicProcedure, router } from "./trpc";

   export const appRouter = router({
     todos: publicProcedure.query(() => [1, 2, 3, 4, 5, 6, 3]),
   });

   export type AppRouter = typeof appRouter;
   ```

5. Create client and provider to be used to call trpc functions:

   - defining the client in `app/_trpc/client.ts`

   ```typescript
   import { createTRPCReact } from "@trpc/react-query";
   import { type AppRouter } from "@/server";

   // this is client for our useQuery Provider
   export const trpc = createTRPCReact<AppRouter>({});
   ```

   - defining the Provider in `app/_trpc/Provider.tsx`

   ```typescript
   "use client";
   import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
   import { httpBatchLink } from "@trpc/client";
   import React, { useState } from "react";
   import { trpc } from "./client";

   // Provider for our useQuery
   export default function Provider({
     children,
   }: {
     children: React.ReactNode;
   }) {
     const [queryClient] = useState(() => new QueryClient());
     const [trpcClient] = useState(() =>
       trpc.createClient({
         links: [
           httpBatchLink({
             url: "http://localhost:3000/trpc",

             // You can pass any HTTP headers you wish here
             //   async headers() {
             //     return {
             //       authorization: getAuthCookie(),
             //     };
             //   },
           }),
         ],
       })
     );

     return (
       <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
           {/* Your app here */}
         </QueryClientProvider>
       </trpc.Provider>
     );
   }
   ```

6. Wrap the children in `app/layout.tsx` with this provider

   ```typescript
   import type { Metadata } from "next";
   import { Inter } from "next/font/google";
   import "./globals.css";
   import Provider from "@/app/_trpc/Provider";
   const inter = Inter({ subsets: ["latin"] });

   export const metadata: Metadata = {
     title: "Todo-trpc",
     description: "A todo app built using next and trpc.",
   };

   export default function RootLayout({
     children,
   }: {?
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <Provider>
           <body className={inter.className}>{children}</body>
         </Provider>
       </html>
     );
   }
   ```

NOTE: in nextjs router any folder of format "\_folderName" is ignored for routing.
