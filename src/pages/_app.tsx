import UserContainer from "@/components/layout/context/user";
import { getServerAuthSession } from "@/server/auth";
import "@/styles/globals.css";
import "easymde/dist/easymde.min.css";
import "highlight.js/styles/github.css"; // Choose the style you prefer
import { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";
import "react-markdown-editor-lite/lib/index.css";

import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

function SafeHydrate({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);

  return client ? children : <div suppressHydrationWarning />;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SafeHydrate>
      <Head>
        <title>AskHub - Your Q&A Plateform</title>
      </Head>
      <SessionProvider session={session}>
        <UserContainer>
          <Component {...pageProps} />
        </UserContainer>
      </SessionProvider>
      <Analytics />
    </SafeHydrate>
  );
}

export const getServerSideProps = async (ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getServerAuthSession(ctx);
  return { props: { session } };
};
