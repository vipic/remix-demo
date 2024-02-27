import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { prisma } from "~/prisma.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  await prisma.remix_user.delete({
    where: {
      id: params.contactId,
    },
  });
  return redirect("/");
};
