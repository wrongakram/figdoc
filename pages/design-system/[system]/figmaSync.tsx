// React
import React, { useState, useEffect } from "react";

// Next
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";

// SWR
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
  PageTitle,
  PageDescription,
} from "../../../components/Core";
import { Button } from "../../../components/FDButton";

import { styled } from "@stitches/react";
import ImportTable from "../../../components/Table";

const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

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
      data: data ?? [],
    },
  };
};

const DesignSystemPage = ({ data, designSystem }: any) => {
  const router = useRouter();
  const { system } = router.query;
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
        <Button>Import</Button>
      </PageHeader>

      <TabFigma data={data} />
    </Page>
  );
};

export default DesignSystemPage;

const TabFigma = ({ data }) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { system } = router.query;

  // States
  const [allFigmaComponents, setAllFigmaComponents] = useState([]);
  const [unSyncedComponents, setUnSyncedComponents] = useState([]);

  // States NEW
  const [parentComponents, setParentComponents] = useState([]);
  const [variants, setVariants] = useState([]);

  // Table Data
  const [rowSelection, setRowSelection] = useState({});
  const [selectedComponents, setSelectedComponents] = useState([]);

  const { data: figmaComponentsAPI, error: figmaComponentsAPIError } = useSWR(
    [
      "https://api.figma.com/v1/files/" + data.figma_file_key + "/components",
      {
        method: "GET",
        headers: {
          "X-Figma-Token": process.env.NEXT_PUBLIC_FIGMA_TOKEN,
        },
      },
    ],
    fetcher
  );

  const { data: figmaFileAPI, error: figmaFileAPIError } = useSWR(
    [
      "https://api.figma.com/v1/files/" + data.figma_file_key,
      {
        method: "GET",
        headers: {
          "X-Figma-Token": process.env.NEXT_PUBLIC_FIGMA_TOKEN,
        },
      },
    ],
    fetcher
  );

  useEffect(() => {
    if (figmaComponentsAPI && figmaFileAPI) {
      let componentsFromFigma: any[] = _.uniqBy(
        figmaComponentsAPI.meta.components.map((i) => i.containing_frame),
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
    }
  }, [figmaComponentsAPI, figmaFileAPI, data]);

  useEffect(() => {
    let filterSelectedComponents = _.keys(rowSelection).map((id) => {
      return parentComponents[id];
    });

    setSelectedComponents(filterSelectedComponents);
  }, [rowSelection]);

  function numberOfVariants(id) {
    let variants = _.filter(
      figmaComponentsAPI.meta?.components,
      function (obj) {
        return _.some(obj.containing_frame, { nodeId: id });
      }
    );

    return variants.length;
  }

  if (figmaComponentsAPIError && figmaFileAPIError) {
    return <p>No figma file key specified... add one now :)</p>;
  }
  if (!figmaComponentsAPI && !figmaFileAPI) return <p>"Loading..."</p>;

  const bulkCreateComponent = async () => {
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
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
          },
        ]);
        if (error) throw error;
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      {data.figma_file_key === null ? (
        <p>No figma file key specified... add one now :)</p>
      ) : parentComponents.length ? (
        <>
          <ImportContainer>
            <Flex>
              <>
                <ImportTable
                  parentComponents={parentComponents}
                  numberOfVariants={numberOfVariants}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                />
                <Button onClick={bulkCreateComponent}>View components</Button>

                <small>
                  <pre>{JSON.stringify(parentComponents, null, 2)}</pre>
                  <hr />
                  <pre>{JSON.stringify(data.component, null, 2)}</pre>
                </small>
              </>
            </Flex>
          </ImportContainer>
        </>
      ) : (
        <>
          <pre>{JSON.stringify(parentComponents, null, 2)}</pre>
          <p>No new components to import</p>
        </>
      )}
    </div>
  );
};

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
