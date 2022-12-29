import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Component,
  ReactElement,
} from "react";
import { styled } from "../../../../stitches.config";

// Next
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";

// Utils
import _ from "lodash";
import Navbar from "../../../../components/Navbar";

// Components
import * as ScrollArea from "@radix-ui/react-scroll-area";

// import Loader from "../../../../components/app/Loader";
import Leaf from "../../../../components/editor/Leaf";
import Element from "../../../../components/editor/Element";
import isHotkey from "is-hotkey";
import Editor from "../../../../components/editor/Editor";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { EditorPlayground } from "../../../../components/editor/EditorPlayground";

import dynamic from "next/dynamic";
import Layout from "../../../../components/Layout";
import FigmaComponentPreview from "../../../../components/editor/FigmaComponentPreview";
const ComponentEditor = dynamic(
  () => import("../../../../components/editor/Editor"),
  {
    ssr: false,
  }
);

// This gets called on every request
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // Run queries with RLS on the server
  const { data } = await supabase
    .from("design_system")
    .select("*")
    .filter("id", "eq", ctx.params?.system)
    .select("*, component (*)")
    .filter("component.id", "eq", ctx.params?.component)
    .single();

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data,
    },
  };
};

export const Page = styled("div", {
  padding: "24px",
  height: "calc(100vh - 88px)",
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "40px",
});

const ContainerChild = styled("div", {
  width: 720,
  height: "100%",
  margin: "0 auto",
});

const ComponentPage = ({ data }: any) => {
  const router = useRouter();
  const { component } = router.query;
  const supabaseClient = useSupabaseClient();

  const [currentMark, setCurrentMark] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showFigmaProps, setShowFigmaProps] = useState(true);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Page css={{ padding: 0 }}>
      <Navbar
        data={data}
        showFigmaProps={showFigmaProps}
        setShowFigmaProps={setShowFigmaProps}
      />
      <ScrollAreaRoot>
        <ScrollAreaViewport>
          <SidebarSection>
            <Container css={{ padding: "0 24px" }}>
              <ContainerChild key={data.component[0]?.id} css={{ gap: 16 }}>
                <ComponentEditor data={data} component={component} />
              </ContainerChild>
            </Container>
          </SidebarSection>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="vertical">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaScrollbar orientation="horizontal">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner />
      </ScrollAreaRoot>
    </Page>
  );
};

export default ComponentPage;

// EDITOR COMPONENT

// FIGMA EMBED

ComponentPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

const ScrollAreaRoot = styled(ScrollArea.Root, {
  height: "calc(100% )",
  overflow: "hidden",
});

const ScrollAreaViewport = styled(ScrollArea.Viewport, {
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
});

const ScrollAreaScrollbar = styled(ScrollArea.Scrollbar, {
  display: "flex",
  // ensures no selection
  userSelect: "none",
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: "none",
  padding: 2,
  transition: "background 160ms ease-out",
  '&[data-orientation="vertical"]': { width: 10 },
  '&[data-orientation="horizontal"]': {
    flexDirection: "column",
    height: 10,
  },
});

const ScrollAreaThumb = styled(ScrollArea.Thumb, {
  flex: 1,
  background: "$gray8",
  borderRadius: 10,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    minWidth: 44,
    minHeight: 44,
  },
});

const ScrollAreaCorner = styled(ScrollArea.Corner, {
  background: "blue",
});

const SidebarSection = styled("div", {
  height: "auto",
});
