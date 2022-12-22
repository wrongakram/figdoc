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
import * as Tabs from "@radix-ui/react-tabs";

// import Loader from "../../../../components/app/Loader";
import Leaf from "../../../../components/editor/Leaf";
import Element from "../../../../components/editor/Element";
import isHotkey from "is-hotkey";
import Editor from "../../../../components/editor/Editor";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { EditorPlayground } from "../../../../components/editor/EditorPlayground";

import dynamic from "next/dynamic";
import ComponentFigmaProps from "../../../../components/ComponentProps";
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
      componentDocumentation: data?.component[0]?.documentation,
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

const ComponentPage = ({ data, componentDocumentation }: any) => {
  const router = useRouter();
  const { component } = router.query;
  const supabaseClient = useSupabaseClient();

  const [currentMark, setCurrentMark] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [showFigmaProps, setShowFigmaProps] = useState(true);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Page css={{ padding: 0 }}>
      <Navbar
        data={data}
        readOnly={readOnly}
        setReadOnly={setReadOnly}
        showFigmaProps={showFigmaProps}
        setShowFigmaProps={setShowFigmaProps}
      />
      <Container css={{ padding: "0 24px" }}>
        <ContainerChild key={data.component[0].id} css={{ gap: 16 }}>
          <ComponentEditor
            data={data}
            componentDocumentation={componentDocumentation}
            component={component}
            readOnly={readOnly}
          />
          {/* {showFigmaProps && <ComponentFigmaProps designSystem={data} />} */}
        </ContainerChild>
      </Container>
    </Page>
  );
};

export default ComponentPage;

// FIGMA COMPONENT PROPS

const TabsRoot = styled(Tabs.Root, {
  display: "flex",
  flexDirection: "column",
});

const TabsList = styled(Tabs.List, {
  flexShrink: 0,
  display: "flex",
});

const TabsTrigger = styled(Tabs.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  padding: "0 20px",
  height: 48,
  display: "flex",
  alignItems: "center",
  fontSize: 14,
  lineHeight: 1,
  color: "$gray11",
  userSelect: "none",
  cursor: "pointer",
  borderRadius: "6px",
  "&:hover": { background: "$gray3" },
  '&[data-state="active"]': {
    color: "$gray12",
    background: "$gray4",
  },
  "&:focus": { position: "relative", boxShadow: `0 0 0 2px black` },
});

const TabsContent = styled(Tabs.Content, {
  flexGrow: 1,
  padding: 20,
  backgroundColor: "white",
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  outline: "none",
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

// EDITOR COMPONENT

// FIGMA EMBED

ComponentPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
