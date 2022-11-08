// src/server/router/_app.ts
import { router } from "../trpc";

import { user } from "./user";
import { channel } from "./channel";

export const appRouter = router({
  user,
  channel,
});

// export type definition of API
export type AppRouter = typeof appRouter;
