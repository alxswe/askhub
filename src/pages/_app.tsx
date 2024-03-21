import UserContainer from "@/components/layout/context/user";
import { getServerAuthSession } from "@/server/auth";
import "@/styles/globals.css";
import "easymde/dist/easymde.min.css";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export function reportWebVitals(metric: any) {
  console.log(metric);
}

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
        <title>AskHub - Your Q&A Platform</title>
        <meta property="description" content="Platform to Q&A" />
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  return { props: { session } };
};
