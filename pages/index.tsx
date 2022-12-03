// Next
import { GetServerSidePropsContext } from "next";

// Context
import ToastContext from "../context/ToastContext";
import { useContext } from "react";

// Supabase
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Types
import { DesignSystemData } from "../types";

// Components
import { Button } from "../components/FDButton";
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageGrid,
} from "../components/Core";
import CreateNewDesignSystemDialog from "../components/Modals/CreateDesignSystem";

// Icons
import { Plus } from "iconoir-react";
import { FDDesignSystemCards } from "../components/FDCards";
import { styled } from "../stitches.config";

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
        destination: "/login",
        permanent: false,
      },
    };

  // Run queries with RLS on the server
  const { data } = await supabase.from("design_system").select("*");

  return {
    props: {
      initialSession: session,
      user: session?.user,
      data: data,
    },
  };
};

const Home = ({ user, data }: { data: DesignSystemData }) => {
  const context = useContext(ToastContext);
  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>
            Home <BetaLabel>Beta</BetaLabel>
          </PageTitle>
          <PageDescription>
            👋 Welcome {user.user_metadata.name}
          </PageDescription>
        </div>
        <CreateNewDesignSystemDialog>
          <Button>
            <Plus /> Create
          </Button>
        </CreateNewDesignSystemDialog>
      </PageHeader>
      <div>
        <Heading3>My Design Systems</Heading3>
        <PageGrid>
          {data.map((system) => (
            <FDDesignSystemCards key={system.id} system={system} />
          ))}
        </PageGrid>
      </div>
    </Page>
  );
};

const Heading3 = styled("h3", {
  fontSize: "$4",
  fontWeight: 600,
  color: "$gray12",
  marginBottom: "$6",
  paddingTop: "$8",
  marginTop: "$8",
  borderTop: "1px solid $gray3",
});

const BetaLabel = styled("div", {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: ".5px",
  fontWeight: 600,
  padding: "4px 6px",
  backgroundColor: "$blue3",
  color: "$blue11",
  borderRadius: 6,
  marginLeft: 12,
});

export default Home;
