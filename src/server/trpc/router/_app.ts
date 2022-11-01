// src/server/router/_app.ts
import { router } from "../trpc";

import { user } from "./user";

export const appRouter = router({
  user,
});

// export type definition of API
export type AppRouter = typeof appRouter;
