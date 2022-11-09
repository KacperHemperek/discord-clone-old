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
        const res = await prisma?.channel.create({
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
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { id } = input;
      const channel = await prisma?.channel.findUnique({
        where: { id },
        include: {
          users: { where: {} },
        },
      });

      return channel?.users || null;
    }),
  getChannels: publicProcedure.query(async () => {
    return await prisma?.channel.findMany();
  }),
});
