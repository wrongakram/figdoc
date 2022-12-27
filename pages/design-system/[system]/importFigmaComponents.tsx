// React
import React, { useState, useEffect, ReactElement } from "react";

// Next
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";

// SWR
import useSWRImmutable from "swr/immutable";

// Supabase
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Utils

import _ from "lodash";

// Components
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
} from "../../../components/Core";
import { Button } from "../../../components/FDButton";

import { styled } from "@stitches/react";
import ImportTable from "../../../components/Table";
import Spinner from "../../../components/Spinner";
import { useProfileStore } from "../../../context/ProfileContext";
import EditDesignSystemDialog from "../../../components/Modals/EditDesignSystem";
import { Figma, Refresh, WarningTriangleOutline } from "iconoir-react";
import Layout from "../../../components/Layout";
import { mutate } from "swr";

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

  // Get All the components from the database
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

const ImportFigmaComponents = ({ data, designSystem }: any) => {
  const router = useRouter();
  const { system } = router.query;

  const supabaseClient = useSupabaseClient();
  const user = useUser();

  // States NEW
  const [parentComponents, setParentComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkImportLoading, setBulkImportLoading] = useState(false);

  // Table Data
  const [rowSelection, setRowSelection] = useState({});
  const [selectedComponents, setSelectedComponents] = useState([]);

  const { data: figmaToken } = useProfileStore();

  const { data: figmaComponentsAPI, error: figmaComponentsAPIError } =
    useSWRImmutable([
      "https://api.figma.com/v1/files/" + data.figma_file_key + "/components",
      {
        method: "GET",
        headers: {
          "X-Figma-Token": figmaToken?.figma_token,
        },
      },
    ]);

  const { data: figmaFileAPI, error: figmaFileAPIError } = useSWRImmutable([
    "https://api.figma.com/v1/files/" + data.figma_file_key,
    {
      method: "GET",
      headers: {
        "X-Figma-Token": figmaToken?.figma_token,
      },
    },
  ]);

  useEffect(() => {
    if (figmaComponentsAPI && figmaFileAPI) {
      let componentsFromFigma: any[] = _.uniqBy(
        figmaComponentsAPI.meta?.components.map((i: any) => {
          if (i.containing_frame && !i.containing_frame.name) {
            return { name: i.name, nodeId: i.node_id, ...i.containing_frame };
          }

          if (i.containing_frame) return i.containing_frame;
        }),
        "nodeId"
      );

      let unSyncedComponents = _.differenceBy(
        componentsFromFigma,
        data.component,
        "nodeId"
      );

      setParentComponents(
        unSyncedComponents.map((component) => {
          let filteredComponentsByNodeId = _.filter(
            figmaComponentsAPI.meta?.components,
            function (obj) {
              return _.some(obj.containing_frame, { nodeId: component.nodeId });
            }
          );

          let figmaURL = `https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/${data.figma_file_key}/${figmaFileAPI.name}?node-id=${component.nodeId}`;
          return {
            ...component,
            figma_url: figmaURL.replace(/\s/g, "-"),
            variants: filteredComponentsByNodeId.map((item) => {
              return item.name;
            }),
          };
        })
      );
      setLoading(false);
    }
  }, [figmaComponentsAPI, figmaFileAPI, data]);

  useEffect(() => {
    let filterSelectedComponents = _.keys(rowSelection).map((id) => {
      return parentComponents[id];
    });

    setSelectedComponents(filterSelectedComponents);
  }, [rowSelection, parentComponents]);

  function numberOfVariants(id) {
    let variants = _.filter(
      figmaComponentsAPI.meta?.components,
      function (obj) {
        return _.some(obj.containing_frame, { nodeId: id });
      }
    );

    return variants.length;
  }

  if (figmaComponentsAPIError || figmaFileAPIError) {
    throw figmaComponentsAPIError || figmaFileAPIError;
  }

  // if (!figmaComponentsAPI && !figmaFileAPI) return <p>Loading...</p>;

  const bulkCreateComponent = async () => {
    setBulkImportLoading(true);
    try {
      selectedComponents.map(async (component) => {
        const { error } = await supabaseClient.from("component").insert([
          {
            title: component.name,
            nodeId: component.nodeId,
            created_by: user?.id,
            design_system: system,
            figma_url: component.figma_url,
            documentation: [
              {
                type: "title",
                children: [{ text: component.name }],
              },
              {
                type: "description",
                children: [{ text: "" }],
              },
              {
                type: "embed",
                url:
                  "https://www.figma.com/embed?embed_host=astra&url=" +
                  component.figma_url,
                children: [{ text: "" }],
              },
              {
                type: "props",
                children: [{ text: "" }],
              },
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
          },
        ]);
        if (error) throw error;
      });

      setTimeout(() => {
        router.push(`/design-system/${system}`);
        mutate(`/api/design-systems/${system}`);
        setBulkImportLoading(false);
      }, 1000);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Import Figma components</PageTitle>
          <PageDescription>
            Import components from the figma file associated with your Design
            System.
          </PageDescription>
        </div>
        {selectedComponents.length > 0 && (
          <Button
            onClick={bulkCreateComponent}
            css={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: 44,
              opacity: bulkImportLoading ? 0.5 : 1,
            }}
          >
            {bulkImportLoading ? <Spinner /> : "Import"}
          </Button>
        )}
      </PageHeader>
      <>
        {figmaComponentsAPI?.status === 404 || figmaFileAPI?.status === 404 ? (
          <EmptyState>
            <div className="svg-container">
              <WarningTriangleOutline />
            </div>
            <h3>Couldn&apos;t retrieve your figma file </h3>
            <p>
              Check to make sure you entered the correct
              <EditDesignSystemDialog>
                <span>file key</span>
              </EditDesignSystemDialog>
            </p>
          </EmptyState>
        ) : loading ? (
          <>
            <EmptyState
              css={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 12,
              }}
            >
              <Spinner color="black" />{" "}
              <span>Fetching components from figma...</span>
            </EmptyState>
          </>
        ) : (
          <>
            {parentComponents.length ? (
              <ImportContainer>
                <ImportTable
                  parentComponents={parentComponents}
                  numberOfVariants={numberOfVariants}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                />
              </ImportContainer>
            ) : (
              <EmptyState>
                <div className="svg-container">
                  <Figma />
                </div>
                <h3>0 published components in your figma file</h3>
                <p>
                  Try creating a new component and publishing it within your
                  figma file. Figma only allows published components to be
                  imported.
                </p>
              </EmptyState>
            )}
          </>
        )}
        {}
      </>
    </Page>
  );
};

export default ImportFigmaComponents;

const EmptyState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: 560,
  height: "calc(100vh - 208px)",
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
    fontSize: "$4",
    fontWeight: 600,
    color: "$gray12",
    marginTop: "$4",
  },

  p: {
    fontSize: "$3",
    color: "$gray11",
    marginTop: "$1",
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

const ImportContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  h3: {
    fontSize: 20,
    span: {
      padding: "0 4px",
    },
  },
});

const Flex = styled("div", {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  gap: 8,
});

ImportFigmaComponents.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
