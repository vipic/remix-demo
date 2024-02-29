import { prisma } from "~/prisma.server";

export const queryList = async (input?: string) =>
  await prisma.remix_user.findMany({
    where: {
      OR: [
        {
          first: {
            contains: input,
          },
        },
        {
          last: {
            contains: input,
          },
        },
      ],
    },
  });

export const createContact = async (data) =>
  await prisma.remix_user.create({ data });

export const deleteContact = async (id: string) =>
  await prisma.remix_user.delete({ where: { id } });

export const updateContact = async (id: string, data) =>
  await prisma.remix_user.update({ where: { id }, data });

export const getContact = async (id: string) =>
  await prisma.remix_user.findUnique({ where: { id } });
