import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const user = router({
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      console.log({ input });
      const user = await prisma?.user.create({
        data: {
          email: input.email,
          name: input.name,
        },
      });

      if (user) {
        console.log("user " + user.name + " created succesfully");
      }
    }),
});
