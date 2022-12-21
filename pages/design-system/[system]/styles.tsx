// React
import React, { useState, useEffect, useMemo, ReactElement } from "react";

// Next
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import useSWRImmutable from "swr";

// Supabase
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Utils
import _ from "lodash";

// Components
import {
  Page,
  PageHeader,
  Card,
  PageGrid,
  PageTitle,
  PageDescription,
} from "../../../components/Core";
import { Button } from "../../../components/FDButton";
import CreateComponent from "../../../components/Modals/CreateComponent";
import * as Tabs from "@radix-ui/react-tabs";

import Link from "next/link";

// Icons
import { Plus, Puzzle } from "iconoir-react";
import { styled } from "@stitches/react";
import { FDComponentCard } from "../../../components/ComponentCards";
import { useProfileStore } from "../../../context/ProfileContext";
import Layout from "../../../components/Layout";
import StylesTable from "../../../components/StylesTable";

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient(ctx);

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

  const { data } = await supabase
    .from("design_system")
    .select("*")
    .filter("id", "eq", ctx.params?.system)
    .select("*, component (*)")
    .single();

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data,
    },
  };
};

type Component = {
  id: string;
  created_at: string;
  email: string | null;
  title: string;
  figma_url: string | null;
  description: string | null;
  created_by: string;
  design_system: string;
  documentation: string[];
  thumbnail_url: string | null;
  nodeId: string | null;
}[];

export type DesignSystemData = {
  id: string;
  created_at: string;
  title: string;
  created_by: string;
  description: string | null;
  figma_file_key: string;
  theme: string;
  component: Component[];
};

const Styles = ({ data }: DesignSystemData) => {
  const router = useRouter();
  const { system } = router.query;

  const { data: figmaToken } = useProfileStore();

  const { data: styles, error } = useSWRImmutable([
    "https://api.figma.com/v1/files/" + data.figma_file_key + "/styles",
    {
      method: "GET",
      headers: {
        "X-Figma-Token": figmaToken?.figma_token,
      },
    },
  ]);

  if (error) return <div>failed to load</div>;

  if (!styles) return <div>loading...</div>;

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Styles</PageTitle>
          <PageDescription>
            All your Color, Text, Effect and Grid Styles in one place.
          </PageDescription>
        </div>
      </PageHeader>
      {styles.meta?.styles.length === 0 ? (
        <EmptyState>
          <h3>No styles found</h3>
          <p>
            Looks like there arent any styles within the linked Figma File{" "}
            <span>Learn more</span>
          </p>
        </EmptyState>
      ) : (
        <TabsRoot defaultValue="tab1">
          <TabsList aria-label="Manage your account">
            <TabsTrigger value="tab1">Colors</TabsTrigger>
            <TabsTrigger value="tab2">Text</TabsTrigger>
            <TabsTrigger value="tab3">Effects</TabsTrigger>
            <TabsTrigger value="tab4">Grid</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <StylesTab data={styles} />
          </TabsContent>
          <TabsContent value="tab2">
            <TextTab data={styles} />
          </TabsContent>
          <TabsContent value="tab3">
            {" "}
            <EffectsTab data={styles} />
          </TabsContent>
          <TabsContent value="tab4">
            {" "}
            <GridsTab data={styles} />
          </TabsContent>
        </TabsRoot>
      )}
    </Page>
  );
};

export default Styles;

const StylesTab = ({ data }: any) => {
  const [stylesData, setStylesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    setLoading(true);
    // only return styles that have the style_type of "FILL"
    const colors = data.meta?.styles.filter((style: any) => {
      return style.style_type === "FILL";
    });

    setStylesData(colors);
    setLoading(false);
  }, [data]);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          <StylesTable styles={stylesData} type="styles" />
        </>
      )}
    </>
  );
};

const TextTab = ({ data }: any) => {
  const [textData, setTextData] = useState([]);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    setLoading(true);
    // only return styles that have the style_type of "FILL"
    const text = data.meta?.styles.filter((style: any) => {
      return style.style_type === "TEXT";
    });

    setTextData(text);
    setLoading(false);
  }, [data]);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          <StylesTable styles={textData} preview="small" />
        </>
      )}
    </>
  );
};

const EffectsTab = ({ data }: any) => {
  const [textData, setTextData] = useState([]);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    setLoading(true);
    // only return styles that have the style_type of "FILL"
    const text = data.meta?.styles.filter((style: any) => {
      return style.style_type === "EFFECT";
    });

    setTextData(text);
    setLoading(false);
  }, [data]);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          <StylesTable styles={textData} preview="small" />
        </>
      )}
    </>
  );
};

const GridsTab = ({ data }: any) => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    setLoading(true);
    // only return styles that have the style_type of "FILL"
    const grid = data.meta?.styles.filter((style: any) => {
      return style.style_type === "GRID";
    });

    setGridData(grid);
    setLoading(false);
  }, [data]);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          <StylesTable styles={gridData} preview="small" />
        </>
      )}
    </>
  );
};

const EmptyState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: 560,
  height: 320,
  margin: "0 auto",

  ".svg-container": {
    background: "$gray3",
    display: "flex",
    alignCenter: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    svg: {
      width: 32,
      height: 32,
      color: "$gray500",
    },
  },
  h3: {
    fontSize: "$5",
    fontWeight: 600,
    color: "$gray12",
    marginTop: "$4",
  },

  p: {
    fontSize: "$3",
    color: "$gray11",
    marginTop: "$2",
    span: {
      cursor: "pointer",
      color: "$gray12",
      fontWeight: 500,
      padding: 4,
      borderRadius: 6,
      "&:hover": {
        background: "$gray3",
      },
    },
    a: {
      cursor: "pointer",
      color: "$blue11",
      fontWeight: 500,
      padding: 4,
      borderRadius: 6,
      "&:hover": {
        background: "$blue3",
      },
    },
  },
});

const TabsRoot = styled(Tabs.Root, {
  display: "flex",
  flexDirection: "column",
});

const TabsList = styled(Tabs.List, {
  flexShrink: 0,
  display: "flex",
  borderBottom: `1px solid $gray6`,
});

const TabsTrigger = styled(Tabs.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  backgroundColor: "white",
  padding: "0 20px",
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  lineHeight: 1,
  color: "$gray11",
  userSelect: "none",
  cursor: "pointer",
  "&:first-child": { borderTopLeftRadius: 6 },
  "&:last-child": { borderTopRightRadius: 6 },
  "&:hover": { color: "$gray11", background: "$gray2" },
  '&[data-state="active"]': {
    color: "$gray12",
    boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
  },
  gap: 6,
});

const TabsContent = styled(Tabs.Content, {
  flexGrow: 1,
  paddingTop: 24,
});

Styles.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
