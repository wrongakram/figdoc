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
  // const { data } = await supabase
  //   .from("members")
  //   .select("*")
  //   .filter("design_system_id", "eq", ctx.params?.system)
  //   .select("id, profiles (email)");

  const { data } = await supabase
    .from("design_system")
    .select("*")
    .filter("id", "eq", ctx.params?.system)
    .select("*, component (*)")
    .single();

  // const {data} = await supabase
  // .from("profiles")
  // .select("*")
  // .filter("design_system_id", "eq", ctx.params?.system)

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
        <InviteMembersDialog>
          <Button>Invite</Button>
        </InviteMembersDialog>
      </PageHeader>
      <pre> {JSON.stringify(data, null, 2)}</pre>
    </Page>
  );
};

export default Members;
