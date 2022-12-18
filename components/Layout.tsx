// components/layout.js
import { useState, useEffect, useContext } from "react";
import DashboardSidebar from "./Sidebar";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import SidebarComponents from "./SidebarComponents";

import { useRouter } from "next/router";

import { styled } from "../stitches.config";
import FDToast from "./FDToast";
import ToastContext from "../context/ToastContext";

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
