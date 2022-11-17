import { z } from "zod";
import { publicProcedure, router } from "@server/trpc/trpc";
import { pusherServer } from "@server/helpers/pusher";

export const channel = router({
  createChannel: publicProcedure
    .input(
      z.object({
        name: z.string(),
        desc: z.string(),
        userId: z.number().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, desc, userId } = input;
      if (!userId) return;
      try {
        await prisma?.channel.create({
          data: {
            desc,
            name,
            users: { connect: { id: userId } },
          },
        });
      } catch (error: any) {
        throw new Error(error);
      }
    }),
  getUsers: publicProcedure
    .input(z.object({ id: z.number().nullable() }))
    .query(async ({ input }) => {
      const { id } = input;

      if (!id) return null;
      const channel = await prisma?.channel.findUnique({
        where: { id },
        include: {
          users: { where: {} },
        },
      });

      if (!channel) return null;
      return channel.users;
    }),
  getChannels: publicProcedure.query(async () => {
    const channels = await prisma?.channel.findMany();
    return channels;
  }),
  addUser: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        channelId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, channelId } = input;

      try {
        await prisma?.channel.update({
          where: { id: channelId },
          data: { users: { connect: { id: userId } } },
        });
      } catch (err: any) {
        throw new Error(err);
      }
    }),
  getChannelById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { id } = input;
      return await prisma?.channel.findUnique({ where: { id } });
    }),

  getChannelByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const { name } = input;
      return await prisma?.channel.findUnique({ where: { name } });
    }),
  getMessages: publicProcedure
    .input(z.object({ channelId: z.number() }))
    .query(async ({ input }) => {
      const { channelId } = input;

      const messages = await prisma?.message.findMany({
        where: { channelId },
        select: { user: true, body: true, createdAt: true, id: true },
        orderBy: { createdAt: "desc" },
      });

      return messages;
    }),
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        channelId: z.number(),
        userId: z.number().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, channelId, userId } = input;

      if (!userId) throw new Error(`User id must be provided`);
      console.log("sending message");
      try {
        const newMessage = await prisma?.message.create({
          data: {
            body: message,
            channel: { connect: { id: channelId } },
            user: { connect: { id: userId } },
          },
        });

        if (newMessage) {
          await pusherServer.trigger("chat-connection", "chat-message", {
            id: channelId,
          });
        }
      } catch (err) {
        console.log(err);
        throw new Error("Couldn't send message");
      }
    }),
});
