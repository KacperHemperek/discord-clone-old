import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const user = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ input }) => {
      return prisma?.user.findFirst({
        where: {
          email: input.email,
        },
      });
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      console.log({ input });
      const user = await prisma?.user.create({
        data: {
          email: input.email,
          name: input.name,
        },
      });
      console.log("creating");

      if (user) {
        console.log("user " + user.name + " created succesfully");
      }
    }),
});
