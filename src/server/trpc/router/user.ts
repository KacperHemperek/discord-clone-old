import { z } from "zod";

import { router, publicProcedure } from "@server/trpc/trpc";
import { prisma } from "@server/db/client";
import { pusherServer } from "@server/helpers/pusher";
import { User } from "@prisma/client";

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
        avatar: z.string().nullable().optional(),
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
          avatar: input.avatar,
        },
      });

      if (!user) {
        throw new Error("There was an error creating user");
      }

      console.log("user " + user.name + " created succesfully");
      pusherServer.trigger("user-connection", "user-created", user);

      return user;
    }),

  editUser: publicProcedure
    .input(
      z.object({
        name: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
        userId: z.number().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, avatar, userId } = input;
      if (!userId) {
        console.error("Couldn't create user with no id");
        return;
      }
      let user: User | null = null;
      if (name && avatar) {
        user = await prisma.user.update({
          where: { id: userId },
          data: { name, avatar },
        });
      }
      if (name) {
        user = await prisma.user.update({
          where: { id: userId },
          data: { name },
        });
      }
      if (avatar) {
        user = await prisma.user.update({
          where: { id: userId },
          data: { avatar },
        });
      }

      return user;
    }),
});
