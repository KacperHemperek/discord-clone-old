import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const channel = router({
  createChannel: publicProcedure
    .input(z.object({ name: z.string(), desc: z.string(), userId: z.number() }))
    .mutation(async ({ input }) => {
      const { name, desc, userId } = input;

      const user = await prisma?.user.findUnique({ where: { id: userId } });

      prisma?.channel.create({
        data: {
          desc,
          name,
          users: { connect: { id: userId } },
        },
      });
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

      console.log(channel);
    }),
});
