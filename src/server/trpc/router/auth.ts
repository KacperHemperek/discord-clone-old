import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const auth = router({
  validate: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      console.log({ input });
    }),
});
