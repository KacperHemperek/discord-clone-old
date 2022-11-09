import { z } from "zod";
import { publicProcedure, router } from "../trpc";

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
    console.log(channels);
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
        const res = await prisma?.channel.update({
          where: { id: channelId },
          data: { users: { connect: { id: userId } } },
          select: { users: true },
        });

        console.log({ users: res?.users });
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
});
