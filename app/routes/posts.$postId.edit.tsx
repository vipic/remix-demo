// app/routes/posts.$postId.edit.tsx

import {
  LoaderFunctionArgs,
  json,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { prisma } from "~/prisma.server";
import {
  useLoaderData,
  Form,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Input, Textarea, Button } from "@nextui-org/react";

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
export const action = async ({ params, request }: ActionFunctionArgs) => {
  const postId = params.postId as string;
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const slug = formData.get("slug") as string;
  const action = formData.get("action") as "edit" | "delete";
  if (action === "delete") {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return redirect("/");
  } else {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        id: slug,
        title,
        content,
      },
    });
    return redirect(`/posts/${slug}`);
  }
};

export default function Page() {
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isDeleting =
    navigation.state === "submitting" &&
    navigation.formData?.get("action") === "delete";
  const isEditing =
    navigation.state === "submitting" &&
    navigation.formData?.get("action") === "edit";

  return (
    <div className="p-12">
      <Form method="POST">
        <div className="flex flex-col gap-3">
          <Input label="slug" name="slug" defaultValue={loaderData.post.id} />
          <Input
            label="标题"
            name="title"
            defaultValue={loaderData.post.title}
          />
          <Textarea
            minRows={10}
            label="正文"
            name="content"
            defaultValue={loaderData.post.content}
          />
          <Button isLoading={isEditing} type="submit" color="primary">
            更新
          </Button>
          <Button
            isLoading={isDeleting}
            name="action"
            value="delete"
            type="submit"
            color="danger"
            onClick={() => {
              if (confirm("确定删除吗？")) {
                const formData = new FormData();
                formData.set("action", "delete");
                submit(formData, {
                  method: "POST",
                  action: `/posts/${loaderData.post.id}/delete`,
                });
              }
            }}
          >
            删除
          </Button>
        </div>
      </Form>
    </div>
  );
}
