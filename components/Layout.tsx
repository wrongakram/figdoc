// components/layout.js
import { useState, useEffect, useContext } from "react";
import DashboardSidebar from "./Sidebar";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import SidebarComponents from "./SidebarComponents";

import { useRouter } from "next/router";

import { styled } from "../stitches.config";
import FDToast from "./FDToast";
import ToastContext from "../context/ToastContext";
import { useProfileStore } from "../context/ProfileContext";
import { WarningCircledOutline } from "iconoir-react";
import Profile from "./Modals/Profile";
import { Button } from "./FDButton";

const Main = styled("div", {
  color: "$gray12",
});

const AppContainer = styled("div", {
  height: "100vh",
  width: "100vw",
  display: "flex",
  overflow: "hidden",
});

const Flex = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  overflow: "scroll",
});

const SidebarFlex = styled("div", {
  display: "flex",
  height: "100%",
});

export default function Layout({ children }) {
  const [designSystemName, setDesignSystemName] = useState([]);

  const router = useRouter();
  const path = router.asPath;

  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const context = useContext(ToastContext);
  const { data } = useProfileStore();

  useEffect(() => {
    setTimeout(() => {
      context.setCreateDesignSystemToast(false);
    }, 3000);
  }, [context]);

  if (!user)
    return (
      <AppContainer>
        <Flex>
          <Main>{children}</Main>
        </Flex>
      </AppContainer>
    );

  return (
    <AppContainer>
      <SidebarFlex>
        <DashboardSidebar setDesignSystemName={setDesignSystemName} />
        {path.includes("design-system") ? (
          <SidebarComponents designSystemName={designSystemName} />
        ) : null}
      </SidebarFlex>

      <Flex>
        {data?.figma_token === "" && (
          <Banner>
            <WarningCircledOutline /> Please add a Figma Token to gain access to
            all features.
            <Profile>
              <button>Add Figma Token</button>
            </Profile>
          </Banner>
        )}
        <Main>{children}</Main>
      </Flex>
      <FDToast
        open={context.createDesignSystemToast}
        onOpenChange={context.setCreateDesignSystemToast}
        title="Design System Created!"
        content="We've just released Radix 3.0!"
      />
    </AppContainer>
  );
}

const Banner = styled("div", {
  svg: {
    color: "$violet12",
    width: 18,
  },
  backgroundColor: "$violet3",
  color: "$violet12",
  padding: "12px 16px",
  fontSize: "$2",
  display: "flex",
  gap: 8,
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",

  button: {
    color: "$violet12",
    backgroundColor: "$violet4",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "$1",
    padding: "8px 12px",
    borderRadius: "6px",
    margin: 0,
    "&:hover": {
      backgroundColor: "$violet5",
    },
  },
});
