import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const channel = router({
  createChannel: publicProcedure
    .input(z.object({ name: z.string(), desc: z.string() }))
    .mutation(({ input }) => {
      const { name, desc } = input;
      prisma?.channel.create({
        data: {
          desc,
          name,          
        },
      });
    }),
});
