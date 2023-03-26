import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(20),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 20,
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              handle: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.banned) {
        throw new TRPCError({
          message: "Banned",
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.session.user.id,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              handle: true,
            },
          },
        },
      });
    }),
});
