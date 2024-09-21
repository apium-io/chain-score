import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import Layout from "@/components/layout";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { WalletProvider } from "@/components/WalletContext";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "My DApp",
          url: typeof window !== "undefined" ? window.location.href : "",
        },
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
      }}
    >
      <SessionProvider session={session}>
        <WalletProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletProvider>
      </SessionProvider>
    </MetaMaskProvider>
  );
}
