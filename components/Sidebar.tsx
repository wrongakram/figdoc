import React, { useEffect, useState } from "react";
import { styled, keyframes } from "../stitches.config";
import useSWR from "swr";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useUser } from "@supabase/auth-helpers-react";

import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "next-themes";

import { useRouter } from "next/router";
// Tooltip
import * as Tooltip from "@radix-ui/react-tooltip";

import Link from "next/link";

// Components
import FDAvatar from "./avatar";

import Loader from "react-loading-skeleton";
import {
  Plus,
  HomeSimpleDoor,
  Lifebelt,
  Svg3DSelectFace,
  HalfMoon,
  SunLight,
} from "iconoir-react";
import Image from "next/image";
import logo from "../public/fig.png";
import CreateNewDesignSystemDialog from "./Modals/CreateDesignSystem";
import Profile from "./Modals/Profile";

const Button = styled("button", {
  height: "36px",
  width: "36px",
  borderRadius: "8px",
  color: "$gray12",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:focus": {
    border: "solid 2px $blue11",
  },

  variants: {
    small: {
      true: {
        height: "28px",
        width: "28px",
        color: "$gray11",
      },
    },
  },
});

const SidebarMain = styled("div", {
  backgroundColor: "$gray1",
  borderRight: "1px solid $gray4",
  color: "$gray12",
  left: 0,
  width: "60px",
  height: "100%",

  display: "flex",
  flexDirection: "column",
});

const SidebarHeader = styled("div", {
  height: "64px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
  fontSize: "16px",
});

const Logo = styled("div", {
  fontSize: 14,
  fontWeight: "500",
});

const Divider = styled("div", {
  padding: "16px 8px",
  width: "100%",

  "&::before": {
    content: ``,
    display: "block",
    height: "1px",
    background: "$gray4",
  },
});

const SidebarSection = styled("div", {
  height: "auto",
  display: "flex",
  justifyContent: "center",
});

const NavMenuList = styled(NavigationMenu.List, {
  listStyle: "none",
  padding: "0",
  margin: "0",
  display: "flex",
  flexDirection: "column",
  gap: 2,
});

const NavMenuItem = styled(NavigationMenu.Item, {
  width: 40,
});

const NavMenuNextLink = styled(Link, {
  listStyle: "none",
  margin: "none",
  display: "flex",
  cursor: "pointer",
  height: 40,
  width: 40,
  borderRadius: "8px",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  color: "$gray11",

  "&:hover": {
    background: "$gray3",
  },

  variants: {
    secondary: {
      true: {
        color: "$gray11",
      },
    },
    active: {
      true: {
        background: "$gray4",
        color: "$gray12",
      },
    },

    color: {
      violet: {
        color: "$violet8",
        "&:hover": {
          color: "$violet9",
          backgroundColor: "$violet3",
        },
      },
      green: {
        color: "$green8",
        "&:hover": {
          color: "$green9",
          backgroundColor: "$green3",
        },
      },
      blue: {
        color: "$blue8",
        "&:hover": {
          color: "$blue9",
          backgroundColor: "$blue3",
        },
      },
      pink: {
        color: "$pink8",
        "&:hover": {
          color: "$pink9",
          backgroundColor: "$pink3",
        },
      },
      orange: {
        color: "$orange8",
        "&:hover": {
          color: "$orange9",
          backgroundColor: "$orange3",
        },
      },
    },
  },

  compoundVariants: [
    {
      color: "violet",
      active: true,
      css: {
        color: "$violet11",
        backgroundColor: "$violet3",
      },
    },
    {
      color: "green",
      active: true,
      css: {
        color: "$green11",
        backgroundColor: "$green3",
      },
    },
    {
      color: "blue",
      active: true,
      css: {
        color: "$blue11",
        backgroundColor: "$blue3",
      },
    },
    {
      color: "pink",
      active: true,
      css: {
        color: "$pink11",
        backgroundColor: "$pink3",
      },
    },
    {
      color: "orange",
      active: true,
      css: {
        color: "$orange11",
        backgroundColor: "$orange3",
      },
    },
  ],
});

const NavMenuLink = styled(NavigationMenu.Link, {
  listStyle: "none",
  margin: "none",
  display: "flex",
  cursor: "pointer",
  height: 40,
  width: 40,
  borderRadius: "8px",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  color: "$gray11",

  "&:hover": {
    background: "$gray3",
  },
  variants: {
    secondary: {
      true: {
        color: "$gray11",
      },
    },
    active: {
      true: {
        background: "$gray4",
        color: "$gray12",
      },
    },

    color: {
      violet: {
        color: "$violet8",
        "&:hover": {
          color: "$violet9",
          backgroundColor: "$violet3",
        },
      },
      green: {
        color: "$green8",
        "&:hover": {
          color: "$green9",
          backgroundColor: "$green3",
        },
      },
    },
  },
});

const SidebarFooter = styled("div", {
  marginTop: "auto",
  paddingBottom: 24,
});

const DashboardSidebar = ({ setDesignSystemName }) => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme == "light" ? "dark" : "light");
  };

  const router = useRouter();
  const path = router.asPath;
  const user = useUser();

  // NavigationMenu.Link Need to figure out how to use with Next Link

  return (
    <SidebarMain>
      <SidebarHeader>
        <Logo>.fd</Logo>
      </SidebarHeader>
      <SidebarSection>
        <NavigationMenu.Root>
          <NavMenuList>
            <Tooltip.Root>
              <NavMenuItem>
                <Tooltip.Trigger asChild>
                  <NavMenuNextLink href="/home" active={path == "/home"}>
                    <HomeSimpleDoor />
                  </NavMenuNextLink>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <TooltipContent side="right" sideOffset={8}>
                    Home
                  </TooltipContent>
                </Tooltip.Portal>
              </NavMenuItem>
            </Tooltip.Root>
          </NavMenuList>
        </NavigationMenu.Root>
      </SidebarSection>
      <Divider />
      <SidebarSection>
        <NavigationMenu.Root>
          <NavMenuList>
            <DesignSystemList setDesignSystemName={setDesignSystemName} />
            <Tooltip.Root>
              <NavMenuItem>
                <Tooltip.Trigger asChild>
                  <NavMenuLink>
                    <CreateNewDesignSystemDialog>
                      <Button>
                        <Plus />
                      </Button>
                    </CreateNewDesignSystemDialog>
                  </NavMenuLink>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <TooltipContent side="right" sideOffset={8}>
                    New Design System
                  </TooltipContent>
                </Tooltip.Portal>
              </NavMenuItem>
            </Tooltip.Root>
          </NavMenuList>
        </NavigationMenu.Root>
      </SidebarSection>
      <SidebarFooter>
        <SidebarSection>
          <NavigationMenu.Root>
            <NavMenuList>
              <Tooltip.Root>
                <NavMenuItem>
                  <Tooltip.Trigger asChild>
                    <NavMenuNextLink href="/guide" active={path == "/guide"}>
                      <Lifebelt />
                    </NavMenuNextLink>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <TooltipContent side="right" sideOffset={8}>
                      Guide
                    </TooltipContent>
                  </Tooltip.Portal>
                </NavMenuItem>
              </Tooltip.Root>

              <Tooltip.Root>
                <NavMenuItem>
                  <Tooltip.Trigger asChild>
                    <NavMenuLink onClick={toggleTheme}>
                      {/* {theme === "light" ? <HalfMoon /> : <SunLight />} */}
                      <HalfMoon />
                    </NavMenuLink>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <TooltipContent side="right" sideOffset={8}>
                      {theme === "light"
                        ? "Bring the moon"
                        : "Turn the lights on"}
                    </TooltipContent>
                  </Tooltip.Portal>
                </NavMenuItem>
              </Tooltip.Root>
              <Divider />
              <Tooltip.Root>
                <NavMenuItem>
                  <Tooltip.Trigger asChild>
                    <NavMenuLink>
                      <Profile>
                        <Button>
                          <FDAvatar
                            img={user?.user_metadata.avatar_url}
                            title={"Akram"}
                          />
                        </Button>
                      </Profile>
                    </NavMenuLink>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <TooltipContent side="right" sideOffset={8}>
                      Profile
                    </TooltipContent>
                  </Tooltip.Portal>
                </NavMenuItem>
              </Tooltip.Root>
            </NavMenuList>
          </NavigationMenu.Root>
        </SidebarSection>
      </SidebarFooter>
    </SidebarMain>
  );
};

export default DashboardSidebar;

const DesignSystemList = ({ setDesignSystemName }) => {
  const { data, error } = useSWR(
    `http://localhost:3000/api/design-systems/getAllDesignSystems`
  );

  useEffect(() => {
    if (data) {
      setDesignSystemName(data);
    }
  }, [data]);

  if (error) {
    return <p>404</p>;
  }

  if (!data)
    return (
      <>
        <Loader height="40px" count={2} borderRadius={8} />
      </>
    );

  const router = useRouter();
  const path = router.asPath;
  const { system } = router.query;

  return (
    <>
      {" "}
      {data.map((design_system: any) => {
        return (
          <Tooltip.Root key={design_system.id}>
            <NavMenuItem>
              <Tooltip.Trigger asChild>
                <NavMenuNextLink
                  color={design_system.theme}
                  href={`/design-system/${design_system.id}`}
                  active={system == design_system.id}
                >
                  <Svg3DSelectFace />
                </NavMenuNextLink>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <TooltipContent side="right" sideOffset={8}>
                  {design_system.title}
                </TooltipContent>
              </Tooltip.Portal>
            </NavMenuItem>
          </Tooltip.Root>
        );
      })}
    </>
  );
};

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const TooltipContent = styled(Tooltip.Content, {
  borderRadius: 6,
  padding: "12px 8px",
  fontSize: 12,
  lineHeight: 1,
  color: "$gray1",
  backgroundColor: "$gray12",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  userSelect: "none",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="delayed-open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});
