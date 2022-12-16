// Styled
import { styled } from "../stitches.config";

// Next
import { GetServerSidePropsContext } from "next";

// Context
import ToastContext from "../context/ToastContext";
import { useContext, useEffect, useState } from "react";

// Supabase
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Types
import { DesignSystemData } from "../types";

// Lodash
import _ from "lodash";

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
import {
  ArrowRight,
  Plus,
  RightRoundArrow,
  Svg3DSelectFace,
} from "iconoir-react";
import Link from "next/link";

// This gets called on every request
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
    },
  };
};

const Home = () => {
  return (
    <HomePage>
      <HomeNav>
        <HomeNavLeft>
          <HomeNavLogo>
            <HomeNavLogoText>.figdoc</HomeNavLogoText>
            <BetaLabel>Beta</BetaLabel>
          </HomeNavLogo>
        </HomeNavLeft>
        <HomeNavRight>
          <Link href="/login">
            <Button>
              Get started <ArrowRight />
            </Button>
          </Link>
        </HomeNavRight>
      </HomeNav>
      <HomeHero>
        <HomeHeroText>
          <HomeHeroTitle>
            Document your Figma Components with ease
          </HomeHeroTitle>
          <HomeHeroSubtitle>
            {/* A design system for the modern web. */}
          </HomeHeroSubtitle>
        </HomeHeroText>
      </HomeHero>
    </HomePage>
  );
};

const HomePage = styled("div", {
  height: "100vh",
  width: "100vw",
  backgroundColor: "$gray1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "&:before": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "80vh",
    backgroundColor: "$gray3",
  },
});

const HomeNav = styled("div", {
  zIndex: 1,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: 1200,
  padding: "0 24px",
  height: 80,
});

const HomeNavLeft = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
});

const HomeNavLogo = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
});

const HomeNavLogoText = styled("div", {
  fontSize: 18,
  fontWeight: 400,
  color: "$gray12",
});

const HomeNavRight = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 8,
});

const HomeNavButton = styled("a", {
  fontSize: 14,
  fontWeight: 500,
  color: "$gray11",
  textDecoration: "none",
  padding: "8px 16px",
  borderRadius: 6,
  marginLeft: 12,
  "&:hover": {
    backgroundColor: "$gray3",
  },
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

const HomeHero = styled("div", {
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: 1200,
  padding: "0 24px",
  height: "100%",
});

const HomeHeroText = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "0 24px",
  height: "100%",
});

const HomeHeroTitle = styled("div", {
  fontSize: 24,
  fontWeight: 700,
  color: "$gray12",
  textAlign: "center",
});

const HomeHeroSubtitle = styled("div", {
  fontSize: 24,
  fontWeight: 400,
  color: "$gray11",
  textAlign: "center",
  marginTop: 12,
});

export default Home;
