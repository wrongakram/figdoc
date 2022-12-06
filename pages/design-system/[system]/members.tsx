import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import {
  Page,
  PageHeader,
  Card,
  PageGrid,
  PageTitle,
  PageDescription,
} from "../../../components/Core";
import { Button } from "../../../components/FDButton";
import InviteMembersDialog from "../../../components/Modals/InviteMembers";

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

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data,
    },
  };
};

const Members = ({ data }) => {
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
      <pre> {JSON.stringify(data, null, 2)}</pre>
    </Page>
  );
};

export default Members;
