import { Key, useEffect, useState } from "react";
import { json, redirect, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

import appStylesHref from "./app.css";
import { prisma } from "~/prisma.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: appStylesHref }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const contacts = await prisma.remix_user.findMany({
    where: {
      OR: [{ first: { contains: q } }, { last: { contains: q } }],
    },
  });
  return json({ contacts, q });
};

export const action = async () => {
  const contact = await prisma.remix_user.create({
    data: {
      id: Math.random().toString(36).substring(2, 9),
    },
  });
  console.log(contact.id);
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const [query, setQuery] = useState(q || "");
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    setQuery(q || "");
  }, [q]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
            >
              <input
                id="q"
                className={searching ? "loading" : ""}
                value={query}
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                }}
                defaultValue={q || ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <p>{contacts.length} 个人</p>
            {contacts.length ? (
              <ul>
                {contacts.map(
                  (contact: {
                    id: Key | null | undefined;
                    first: string;
                    last: string;
                    favorite: boolean;
                  }) => (
                    <li key={contact.id}>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive ? "active" : isPending ? "isPending" : ""
                        }
                        to={`contacts/${contact.id}`}
                      >
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        {contact.favorite ? <span>★</span> : null}
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={
            navigation.state === "loading" && !searching ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
