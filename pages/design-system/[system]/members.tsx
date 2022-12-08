import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import {
  Page,
  PageHeader,
  Card,
  PageGrid,
  PageTitle,
  PageDescription,
} from "../../../components/Core";
import { Button } from "../../../components/FDButton";
import MembersTable from "../../../components/MembersTable";
import InviteMembersDialog from "../../../components/Modals/InviteMembers";
import * as Tabs from "@radix-ui/react-tabs";
import { styled } from "../../../stitches.config";

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

  // Get design system details

  const { data } = await supabase
    .from("members")
    .select("*, design_system (*)")
    .filter("design_system_id", "eq", ctx.params?.system);

  const { data: invites } = await supabase
    .from("invites")
    .select("*")
    .filter("design_system_id", "eq", ctx.params?.system);

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data,
      invites: invites,
    },
  };
};

const Members = ({ data, invites }) => {
  const [rowSelection, setRowSelection] = useState({});

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Members</PageTitle>
          <PageDescription>
            Invite people to the Mushroom Design System
          </PageDescription>
        </div>
        <InviteMembersDialog
          title={data[0].design_system.title}
          theme={data[0].design_system.theme}
        >
          <Button>Invite</Button>
        </InviteMembersDialog>
      </PageHeader>

      <TabsRoot defaultValue="tab1">
        <TabsList aria-label="Manage your account">
          <TabsTrigger value="tab1">
            Members{" "}
            <span>
              <span style={{ paddingRight: 2 }}>(</span>
              {data.length}
              <span style={{ paddingLeft: 2 }}>)</span>
            </span>
          </TabsTrigger>
          {invites.length > 0 && (
            <TabsTrigger value="tab2">
              Pending Invites
              <span>
                <span style={{ paddingRight: 2 }}>(</span>
                {invites.length}
                <span style={{ paddingLeft: 2 }}>)</span>
              </span>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="tab1">
          <MembersTable
            members={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            tableType="members"
          />
        </TabsContent>
        {invites.length > 0 && (
          <TabsContent value="tab2">
            <MembersTable
              members={invites}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              tableType="invites"
            />
          </TabsContent>
        )}
      </TabsRoot>

      {/* <pre>{JSON.stringify(data, null, 2)}</pre>

      <pre>{JSON.stringify(invites, null, 2)}</pre> */}
    </Page>
  );
};

export default Members;

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
