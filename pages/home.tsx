// Styled
import { styled } from "../stitches.config";

// Next
import { GetServerSidePropsContext } from "next";

// Context
import ToastContext from "../context/ToastContext";
import { ReactElement, useContext, useEffect, useState } from "react";

// Supabase
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Types
import { User, DesignSystemData } from "../lib/types";

// Lodash
import _ from "lodash";

import { motion } from "framer-motion";

// Components
import { Button } from "../components/FDButton";
import { Page, PageHeader, PageGrid } from "../components/Core";
import CreateNewDesignSystemDialog from "../components/Modals/CreateDesignSystem";
import { FDDesignSystemCards } from "../components/FDCards";
import Spinner from "../components/Spinner";
import Invites from "../components/invites";
import { H2, H4, Subtitle } from "../components/primitives/Text";
import { Flex } from "../components/primitives/structure";
import { EmptyState } from "../components/primitives/EmptyState";

// Icons
import { Plus, Svg3DSelectFace } from "iconoir-react";
import Layout from "../components/Layout";

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

  const { data } = await supabase
    .from("design_system") // Select the design_system table
    .select("*") // Get all the design systems
    .select("*, members (email)"); // Get all the members of the design system

  return {
    props: {
      initialSession: session,
      user: session?.user,
      data: data,
    },
  };
};

const Home = ({ user, data }: { user: User; data: DesignSystemData }) => {
  const [myDesignSystems, setMyDesignSystem] = useState<DesignSystemData>([]);
  const [sharedWithMeDesignSystems, setSharedWithMeDesignSystems] =
    useState<DesignSystemData>([]);
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

  return (
    <Page>
      <PageHeader>
        <div>
          <Flex alignItemsCenter>
            <H2>Home</H2> <BetaLabel>Beta</BetaLabel>
          </Flex>
          <Subtitle> 👋 Welcome {user.user_metadata.name}</Subtitle>
        </div>
        <Flex style={{ gap: 16 }}>
          <Invites />
          <CreateNewDesignSystemDialog>
            <Button>
              <Plus /> Create
            </Button>
          </CreateNewDesignSystemDialog>
        </Flex>
      </PageHeader>
      <>
        {loading ? (
          <EmptyState>
            <Spinner color="black" />
          </EmptyState>
        ) : (
          <>
            {myDesignSystems.length != 0 ? (
              <>
                <H4
                  css={{
                    marginBottom: "$6",
                    paddingTop: "$8",
                    marginTop: "$8",
                    borderTop: "1px solid $gray3",
                  }}
                >
                  My Design Systems
                </H4>
                <PageGrid>
                  {myDesignSystems.map((system) => (
                    <FDDesignSystemCards key={system.id} system={system} />
                  ))}
                </PageGrid>
              </>
            ) : myDesignSystems.length == 0 &&
              sharedWithMeDesignSystems.length >= 1 ? null : (
              <EmptyState css={{ marginTop: 160 }}>
                <motion.div
                  animate={{ y: [1, 4, 1] }}
                  transition={{
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className="svg-container"
                >
                  <Svg3DSelectFace />
                </motion.div>

                <h3>No Design Systems</h3>
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
                <H4
                  css={{
                    marginBottom: "$6",
                    paddingTop: "$8",
                    marginTop: "$8",
                    borderTop: "1px solid $gray3",
                  }}
                >
                  Shared with me
                </H4>
                <PageGrid>
                  {sharedWithMeDesignSystems.map((system) => (
                    <FDDesignSystemCards key={system.id} system={system} />
                  ))}
                </PageGrid>
              </>
            )}
          </>
        )}
      </>
    </Page>
  );
};

const BetaLabel = styled("div", {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: ".5px",
  fontWeight: 600,
  padding: "4px 6px",
  backgroundColor: "$violet3",
  color: "$violet11",
  borderRadius: 6,
  marginLeft: 12,
});

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
