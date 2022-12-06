// Next
import { GetServerSidePropsContext } from "next";

// Context
import ToastContext from "../context/ToastContext";
import { useContext, useEffect, useState } from "react";

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
import { MailIn, Plus, Svg3DSelectFace } from "iconoir-react";
import { FDDesignSystemCards } from "../components/FDCards";
import { styled } from "../stitches.config";
import _ from "lodash";
import Spinner from "../components/Spinner";
import Invites from "../components/invites";

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
  const [myDesignSystems, setMyDesignSystem] = useState([]);
  const [sharedWithMeDesignSystems, setSharedWithMeDesignSystems] = useState(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let my = _.filter(data, function (o) {
      return o.created_by === user.id;
    });

    let shared = _.filter(data, function (o) {
      return o.created_by !== user.id;
    });

    setMyDesignSystem(my);
    setSharedWithMeDesignSystems(shared);
    setLoading(false);
  }, [data, user]);

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
        <div style={{ display: "flex", gap: 16 }}>
          <Invites />
          <CreateNewDesignSystemDialog>
            <Button>
              <Plus /> Create
            </Button>
          </CreateNewDesignSystemDialog>
        </div>
      </PageHeader>
      <div>
        {loading ? (
          <EmptyState>
            <Spinner color="black" />
          </EmptyState>
        ) : (
          <>
            {myDesignSystems.length != 0 ? (
              <>
                <Heading3>My Design Systems</Heading3>
                <PageGrid>
                  {myDesignSystems.map((system) => (
                    <FDDesignSystemCards key={system.id} system={system} />
                  ))}
                </PageGrid>
              </>
            ) : myDesignSystems.length == 0 &&
              sharedWithMeDesignSystems.length >= 1 ? null : (
              <EmptyState>
                <div className="svg-container">
                  <Svg3DSelectFace />
                </div>
                <h3>Looks like you don't have any Design Systems</h3>
                <p>
                  You can create a new Design System by clicking the{" "}
                  <CreateNewDesignSystemDialog>
                    <span>+ Create</span>
                  </CreateNewDesignSystemDialog>{" "}
                  button.
                </p>
              </EmptyState>
            )}
          </>
        )}

        {sharedWithMeDesignSystems.length != 0 && (
          <>
            {loading ? (
              <EmptyState>
                <Spinner color="black" />
              </EmptyState>
            ) : (
              <>
                <Heading3>Shared with me</Heading3>
                <PageGrid>
                  {sharedWithMeDesignSystems.map((system) => (
                    <FDDesignSystemCards key={system.id} system={system} />
                  ))}
                </PageGrid>
              </>
            )}
          </>
        )}
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
      width: 28,
      height: 28,
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
