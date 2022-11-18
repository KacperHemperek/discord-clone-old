import { z } from "zod";

import { router, publicProcedure } from "@server/trpc/trpc";

export const user = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email().nullable() }))
    .query(({ input, ctx }) => {
      if (input.email) {
        return ctx.prisma?.user.findFirst({
          where: {
            email: input.email,
          },
        });
      }
      return null;
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      console.log({ input });
      const welcomeChannel = await ctx.prisma?.channel.findUnique({
        where: { name: "Welcome" },
      });
      const user = await ctx.prisma?.user.create({
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
      if (!user) {
        throw new Error("There was an error creating user");
      }

      console.log("user " + user.name + " created succesfully");
    }),
});
