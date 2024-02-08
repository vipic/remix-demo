// app/routes/posts.$postId.tsx

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/prisma.server";
import ReactMarkdown from "react-markdown";
import { useLoaderData, Link } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const postId = params.postId as string;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Response("找不到文章", {
      status: 404,
    });
  }

  return json({
    post,
  });
};
export default function Page() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="p-12">
      <div className="mb-3">
        <Link to="edit" className="underline">
          编辑
        </Link>
      </div>
      <div className="prose">
        <h1>{loaderData.post.title}</h1>
        <ReactMarkdown>{loaderData.post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
