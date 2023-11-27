"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "./client";
// import { getAuthCookie } from "@/helpers/getAuthCookie";

// Provider for our useQuery
export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc/",
          // You can pass any HTTP headers you wish here
          async headers() {
            const authCookie = localStorage.getItem("token");
            // console.log(authCookie);
            // console.log("akfjba");
            if (authCookie) {
              return {
                authorization: `Bearer ${authCookie}`,
              };
            }
            return {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}{" "}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
