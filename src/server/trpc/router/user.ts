import { z } from "zod";

import { router, publicProcedure } from "@server/trpc/trpc";
import { prisma } from "@server/db/client";

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
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
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
          id: true,
          name: true,
          channels: true,
        },
      });

      if (!user) {
        throw new Error("There was an error creating user");
      }

      console.log("user " + user.name + " created succesfully");
      return user;
    }),

  editUser: publicProcedure
    .input(z.object({ name: z.string().nullable(), avatar: z.string() }))
    .mutation(async ({ input }) => {
      const { name, avatar } = input;
    }),
});
