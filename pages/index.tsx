// Styled
import { styled } from "../stitches.config";

// Next
import { GetServerSidePropsContext } from "next";
import Image from "next/image";

// Context
import ToastContext from "../context/ToastContext";
import { useContext, useEffect, useState } from "react";

// Supabase
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Types
import { DesignSystemData } from "../types";

// Lodash
import _ from "lodash";

// Image
import figDocPreview from "../public/figdoc-preview.png";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {!loading && (
        <HomePage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <HomeNav>
            <HomeNavLeft>
              <HomeNavLogo>
                <HomeNavLogoText>.figdoc</HomeNavLogoText>
              </HomeNavLogo>
            </HomeNavLeft>
            <HomeNavRight>
              <Link href="/login">
                <Button size={"large"} apperance="secondary">
                  Login
                </Button>
              </Link>
              <Link href="/login">
                <Button size={"large"}>
                  Try for free <ArrowRight />
                </Button>
              </Link>
            </HomeNavRight>
          </HomeNav>
          <HomeHero>
            <Label>
              Keep in mind figdoc is in beta... so be aware of bugs 🐞
            </Label>
            <HomeHeroText>
              <HomeHeroTitle>
                Document your <span>Figma</span> Components with ease
              </HomeHeroTitle>
              <HomeHeroSubtitle>
                FigDoc is a documentation tool for Figma components. It allows
                you to create a living style guide for your design system.
              </HomeHeroSubtitle>
            </HomeHeroText>
            <HomeHeroImage>
              <Image
                // loader={myLoader}
                src={figDocPreview}
                alt="figdoc preview"
                quality={100}
              />
            </HomeHeroImage>
          </HomeHero>
          <HomeFeatures>
            <HomeFeaturesTitle>
              All your components <br /> in one place
            </HomeFeaturesTitle>
            <HomeFeaturesGrid>
              <HomeFeature>
                <HomeFeatureTitle>Rich text editor</HomeFeatureTitle>
              </HomeFeature>
              <HomeFeature>
                <HomeFeatureTitle>Automatic prop detection</HomeFeatureTitle>
              </HomeFeature>
              <HomeFeature>
                <HomeFeatureTitle>Color styles</HomeFeatureTitle>
              </HomeFeature>
              <HomeFeature>
                <HomeFeatureTitle>Invite members</HomeFeatureTitle>
              </HomeFeature>
              <HomeFeature>
                <HomeFeatureTitle css={{ border: "none" }}>
                  Import Figma components
                </HomeFeatureTitle>
              </HomeFeature>
              <HomeFeature>
                <HomeFeatureTitle css={{ border: "none" }}>
                  Dark mode
                </HomeFeatureTitle>
              </HomeFeature>
            </HomeFeaturesGrid>
          </HomeFeatures>

          <HomeFooter>
            <HomeFooterLeft>
              <HomeNavLogoText css={{ color: "white" }}>
                .figdoc
              </HomeNavLogoText>
            </HomeFooterLeft>
            <HomeFooterRight>
              <HomeFooterLink>Privacy</HomeFooterLink>
              <HomeFooterLink>Terms</HomeFooterLink>
              <HomeFooterLink>Support</HomeFooterLink>
            </HomeFooterRight>
          </HomeFooter>
        </HomePage>
      )}
    </>
  );
};

const HomePage = styled(motion.div, {
  backgroundColor: "$gray1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  bottomBorder: "1px solid $gray4",
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
  height: 120,
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
  gap: 12,
});

const Label = styled("div", {
  fontSize: 14,
  padding: "8px 16px",
  backgroundColor: "$violet4",
  color: "$violet12",
  borderRadius: 100,
  marginLeft: 12,
  margin: "0 auto 40px",
});

const HomeHero = styled("div", {
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 1200,
  padding: "0 24px",
  height: "100%",
  marginTop: 80,
});

const HomeHeroText = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "0 24px",
  height: "100%",
});

const HomeHeroTitle = styled("div", {
  fontSize: 96,
  fontWeight: 300,
  letterSpacing: "-5px",
  lineHeight: 1.2,
  color: "$gray12",
  textAlign: "center",
  span: {
    color: "$green11",
    background: "$green3",
    padding: "0 20px",
  },
});

const HomeHeroImage = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "0 24px",
  height: "100%",
  margin: "80px 0",
  position: "relative",

  img: {
    width: "100%",
    height: "auto",
    // Box shadow for image
    filter: "drop-shadow(0px 48px 80px rgba(0, 0, 0, 0.1))",
  },
});

const HomeHeroSubtitle = styled("div", {
  fontSize: 16,
  fontWeight: 400,
  color: "$gray11",
  marginTop: 48,
  width: 320,
  position: "relative",
  left: "18%",
  "&:after": {
    content: "",
    position: "absolute",
    width: 72,
    height: 1,
    backgroundColor: "$gray8",
    top: 12,
    left: -96,
  },
});

const HomeFeatures = styled("div", {
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 1200,
  padding: "0 24px",
  height: "100%",
  margin: "120px 0",
});

const HomeFeaturesTitle = styled("div", {
  fontSize: 40,
  lineHeight: 1.3,
  fontWeight: 400,
  color: "$gray12",
  textAlign: "center",
  marginBottom: 48,
});

const HomeFeaturesGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gridGap: 48,
  width: "100%",
  maxWidth: 800,
  padding: "0 24px",
  height: "100%",
  margin: "0px auto",
});

const HomeFeature = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});

const HomeFeatureTitle = styled("div", {
  fontSize: 18,
  fontWeight: 500,
  color: "$gray12",
  padding: "48px 0",
  borderBottom: "1px solid $gray4",
  width: "100%",
});

const HomeFooter = styled("div", {
  zIndex: 1,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: 1200,
  padding: "0 24px",
  height: 120,
  background: "$gray12",
  borderTopLeftRadius: 6,
  borderTopRightRadius: 6,
});

const HomeFooterLeft = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
});

const HomeFooterRight = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
});

const HomeFooterLink = styled("div", {
  fontSize: 14,
  fontWeight: 400,
  color: "white",
  cursor: "pointer",
  "&:hover": {
    color: "$violet9",
  },
});

export default Home;
