// React
import React, { useState, useEffect } from "react";

// Next
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import useSWR from "swr";

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

import Link from "next/link";

// Icons
import { Plus, Puzzle } from "iconoir-react";
import { styled } from "@stitches/react";

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

const DesignSystemPage = ({ data }: DesignSystemData) => {
  const router = useRouter();
  const { system } = router.query;
  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>{data.title}</PageTitle>
          <PageDescription>{data.description}</PageDescription>
        </div>
        <CreateComponent>
          <Button>
            <Plus /> Create
          </Button>
        </CreateComponent>
      </PageHeader>

      {data.component.length === 0 ? (
        <EmptyState>
          <div className="svg-container">
            <Puzzle />
          </div>
          <h3>There are no components in this Design System</h3>
          <p>
            You can create a new component by clicking the{" "}
            <CreateComponent>
              <span>+ Create</span>
            </CreateComponent>{" "}
            button above or you can import a component from Figma via{" "}
            <Link href={`/design-system/${system}/figmaSync`}>Import</Link>
          </p>
        </EmptyState>
      ) : (
        <PageGrid>
          {data.component.map((component) => (
            <ComponentCard
              href={{
                pathname: `/design-system/${system}/component/${component?.id}`,
              }}
              key={component.id}
            >
              <ComponentCoverImage
                fileKey={data.figma_file_key}
                nodeId={component.nodeId}
              />
              {component.nodeId && <FigmaTag>Figma Component</FigmaTag>}
              <div className="content">
                <div className="title">{component.title}</div>
                <div className="description">{component.description}</div>
              </div>
            </ComponentCard>
          ))}
        </PageGrid>
      )}
      <pre> {JSON.stringify(data, null, 2)}</pre>
    </Page>
  );
};

export default DesignSystemPage;

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

// Create New Component

const ComponentCoverImage = ({ fileKey, nodeId }: any) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { system } = router.query;

  // States
  const [allComponentThumbnails, setAllComponentThumbnails] = useState("");

  const { data, error } = useSWR([
    "https://api.figma.com/v1/files/" + fileKey + "/components",
    {
      method: "GET",
      headers: {
        "X-Figma-Token": process.env.NEXT_PUBLIC_FIGMA_TOKEN,
      },
    },
  ]);

  useEffect(() => {
    if (data) {
      let matchingComponents = _.filter(data.meta?.components, function (obj) {
        return _.some(obj.containing_frame, { nodeId: nodeId });
      });

      setAllComponentThumbnails(matchingComponents[0]?.thumbnail_url);
    }
  }, [data]);

  if (error) {
    return (
      <div className="cover">
        <div className="img">No figma key specified</div>
      </div>
    );
  }
  if (!data)
    return (
      <div className="cover">
        <div className="img">loading...</div>
      </div>
    );

  return (
    <div className="cover">
      <div className="img">
        {allComponentThumbnails ? (
          <Image
            // loader={myLoader}
            src={allComponentThumbnails}
            alt="Picture of the author"
            layout="fill"
            objectFit="contain"
            quality={100}
          />
        ) : (
          <ComponentVisual>
            <Puzzle />
          </ComponentVisual>
        )}
      </div>
    </div>
  );
};

const ComponentVisual = styled("div", {
  backgroundColor: "$gray4",
  height: 60,
  width: 60,
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
});

const FigmaTag = styled("div", {
  position: "absolute",
  top: 6,
  right: 6,
  backgroundColor: "$violet3",
  color: "$violet11",
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 500,
  borderRadius: 6,
});

const ComponentCard = styled(Link, {
  borderRadius: 12,
  border: "solid 1px $gray6",
  position: "relative",
  overflow: "hidden",
  paddingBottom: "48px",
  "&:hover": {
    border: "solid 1px $gray8",
  },

  ".cover": {
    background: "$gray1",
    height: "200px",
    display: "block",
    padding: 48,
    ".img": {
      height: "100%",
      position: "relative",
      display: "block",
    },
  },

  ".avatar": {
    position: "absolute",
    left: "16px",
    top: "24px",
  },

  ".content": {
    marginTop: "12px",
    padding: "16px",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    ".title": {
      fontSize: "16px",
      fontWeight: "600",
      color: "$gray12",
    },

    ".description": {
      fontSize: "14px",
      color: "$gray11",
    },
  },

  ".tags-container": {
    position: "absolute",
    bottom: "16px",
    left: "16px",
    ".tag": {
      border: "solid 1px $gray6",
      borderRadius: "100px",
      fontSize: "12px",
      color: "$gray11",
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
      height: "28px",
    },
  },
});
