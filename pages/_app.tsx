import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { darkTheme } from "../stitches.config";
import "../styles/globals.scss";

// Supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

// React
import { useState, createContext } from "react";

// SWR
import { SWRConfig } from "swr";

// Context
import ToastContext from "../context/ToastContext";
import { ProfileProvider } from "../context/ProfileContext";

// Tooltip
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Toast from "@radix-ui/react-toast";
import Layout from "../components/Layout";

// Icons
import { IconoirProvider } from "iconoir-react";

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  // Multiple Layouts

  const [createDesignSystemToast, setCreateDesignSystemToast] = useState(false);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ProfileProvider>
        <Tooltip.Provider delayDuration={250} skipDelayDuration={600}>
          <Toast.Provider swipeDirection="right">
            <ToastContext.Provider
              value={{ createDesignSystemToast, setCreateDesignSystemToast }}
            >
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
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </ThemeProvider>
                </SWRConfig>
              </IconoirProvider>
            </ToastContext.Provider>
          </Toast.Provider>
        </Tooltip.Provider>
      </ProfileProvider>
    </SessionContextProvider>
  );
}
