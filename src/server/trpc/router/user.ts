import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const user = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email().nullable() }))
    .query(({ input }) => {
      if (input.email) {
        return prisma?.user.findFirst({
          where: {
            email: input.email,
          },
        });
      }
      return null;
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      console.log({ input });
      const welcomeChannel = await prisma?.channel.findUnique({
        where: { name: "Welcome" },
      });
      const user = await prisma?.user.create({
        data: {
          email: input.email,
          name: input.name,
          channels: { connect: { id: welcomeChannel?.id } },
        },
        select: {
          name: true,
          channels: true,
        },
      });

      console.log(user?.channels);

      if (user) {
        console.log("user " + user.name + " created succesfully");
      }
    }),
});
