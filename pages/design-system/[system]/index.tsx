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
import { FDComponentCard } from "../../../components/ComponentCards";

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
            <Link href={`/design-system/${system}/importFigmaComponents`}>
              Import
            </Link>
          </p>
        </EmptyState>
      ) : (
        <PageGrid>
          {data.component
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((component: any) => (
              <FDComponentCard
                key={component.id}
                component={component}
                fileKey={data.figma_file_key}
              />
            ))}
        </PageGrid>
      )}
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
