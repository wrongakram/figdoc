import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { darkTheme } from "../stitches.config";
import "../styles/globals.scss";

import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

// Supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

// React
import { useState } from "react";

// SWR
import { SWRConfig } from "swr";

// Context
import { ToastProvider } from "../context/ToastContext";
import { ProfileProvider } from "../context/ProfileContext";

// Tooltip
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Toast from "@radix-ui/react-toast";
import Layout from "../components/Layout";

// Icons
import { IconoirProvider } from "iconoir-react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  // Multiple Layouts

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ProfileProvider>
        <Tooltip.Provider delayDuration={250} skipDelayDuration={600}>
          <Toast.Provider swipeDirection="right">
            <ToastProvider>
              <IconoirProvider
                iconProps={{
                  color: "$gray11",
                  strokeWidth: 1.75,
                }}
              >
                <SWRConfig
                  value={{
                    fetcher: (resource, init) =>
                      fetch(resource, init).then((res) => res.json()),
                  }}
                >
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    value={{
                      dark: darkTheme,
                    }}
                  >
                    {getLayout(<Component {...pageProps} />)}
                  </ThemeProvider>
                </SWRConfig>
              </IconoirProvider>
            </ToastProvider>
          </Toast.Provider>
        </Tooltip.Provider>
      </ProfileProvider>
    </SessionContextProvider>
  );
}
