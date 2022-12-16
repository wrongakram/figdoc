import React, { useEffect, useState } from "react";
import { styled, keyframes } from "../stitches.config";
import useSWR, { useSWRConfig } from "swr";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { violet, mauve, blackA, red } from "@radix-ui/colors";

import { useRouter } from "next/router";
import Link from "next/link";
import {
  Plus,
  Search,
  NavArrowDown,
  OpenNewWindow,
  GridAdd,
  Import,
  TerminalSimple,
  Figma,
  ProfileCircled,
  ViewGrid,
  Packages,
  BookmarkBook,
  DataTransferBoth,
} from "iconoir-react";
import EditDesignSystemDialog from "./Modals/EditDesignSystem";
import { capitalizeFirstLetter } from "../utils/functions/capitalizeFirstLetter";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import _ from "lodash";
import { Flex } from "./primitives/structure";

const Button = styled("button", {
  height: "36px",
  width: "36px",
  borderRadius: "8px",
  color: "$gray11",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",

  "&:focus": {
    border: "solid 2px $blue11",
  },

  "&:hover": {
    backgroundColor: "$gray3",
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
  borderRight: "1px solid $gray4",
  backgroundColor: "$gray1",
  color: "$gray12",
  left: 0,
  width: "228px",
  height: "100%",
});

const SidebarHeader = styled("div", {
  height: "64px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 12px 0 16px",
  fontSize: "14px",
  gap: 12,
  cursor: "pointer",

  svg: {
    color: "$gray11",
  },

  "&:hover": {
    backgroundColor: "$gray3",
  },

  ".content": {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  h4: {
    letterSpacing: "-.025px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  span: {
    fontSize: 11,
    color: "$gray11",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
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
  padding: "0 8px",
});

const Circle = styled("div", {
  height: 6,
  width: 6,
  borderRadius: "100%",
  backgroundColor: "$blue9",
});

const NavMenuList = styled(NavigationMenu.List, {
  listStyle: "none",
  padding: "0",
  margin: "0",
});

const NavMenuItem = styled(NavigationMenu.Item, {});

const NavMenuLink = styled(Link, {
  listStyle: "none",
  margin: "none",
  cursor: "pointer",
  height: 40,
  display: "flex",
  alignItems: "center",
  padding: "0px 8px",
  fontSize: 14,
  borderRadius: 8,
  color: "$gray11",
  gap: 8,
  svg: {
    width: 18,
  },
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
        fontWeight: "500",
        background: "$gray4",
        color: "$gray12",
      },
    },
  },
});

const Subheader = styled("div", {
  padding: "0 4px 0 8px",
  height: "32px",
  textTransform: "uppercase",
  letterSpacing: "0.04rem",
  fontSize: "10.5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontWeight: "600",
  color: "$gray10",
});

const SearchInput = styled("div", {
  margin: "4px 0 12px",
  display: "flex",
  alignItems: "center",
  position: "relative",
  svg: {
    width: 18,
    left: 8,
    position: "absolute",
    color: "$gray10",
    pointerEvents: " none",
  },
});

const Input = styled("input", {
  width: "100%",
  borderRadius: 8,
  padding: "0 12px 0 30px",
  fontSize: 14,
  lineHeight: 1,
  color: "$gray12",
  height: 36,
  backgroundColor: "$gray3",
  boxSizing: "border-box",
  border: "solid 1px $gray5",

  "&::placeholder": {
    color: "$gray10",
  },

  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet8}`, outline: "none" },
});

const SidebarFooter = styled("div", {});

const SidebarComponents = ({ designSystemName }) => {
  const [ds, setDs] = useState();
  const router = useRouter();
  const { system } = router.query;
  const path = router.asPath;

  useEffect(() => {
    designSystemName?.map((ds) => {
      if (ds.id == system) {
        setDs(ds);
      }
    });
  }, [system, designSystemName]);

  return (
    <SidebarMain>
      <FDDropDown ds={ds} system={system}>
        <SidebarHeader>
          <div className="content">
            <>
              <h4>{ds?.title}</h4>
              {ds?.figma_file_key ? (
                <span>{ds?.figma_file_key}</span>
              ) : (
                <span>
                  Connect Figma File <Circle />
                </span>
              )}
            </>
          </div>

          <NavArrowDown />
        </SidebarHeader>
      </FDDropDown>

      <SidebarSection>
        <NavigationMenu.Root>
          <NavMenuList>
            <NavMenuItem>
              <NavMenuLink
                href={`/design-system/${system}`}
                active={path === `/design-system/${system}`}
              >
                <BookmarkBook />
                Components Index
              </NavMenuLink>
            </NavMenuItem>
            {/* {ds?.figma_file_key && (
              <NavMenuItem>
                <NavMenuExternalLink
                  target="_blank"
                  href={` https://www.figma.com/file/${ds.figma_file_key}`}
                  rel="noopener noreferrer"
                >
                  Figma
                  <OpenNewWindow width={14} />
                </NavMenuExternalLink>
              </NavMenuItem>
            )} */}
            <NavMenuItem>
              <NavMenuLink
                href={`/design-system/${system}/importFigmaComponents`}
                active={
                  path === `/design-system/${system}/importFigmaComponents`
                }
              >
                <DataTransferBoth />
                Import components
              </NavMenuLink>
            </NavMenuItem>
            <NavMenuItem>
              <NavMenuLink
                href={`/design-system/${system}/members`}
                active={path === `/design-system/${system}/members`}
              >
                <ProfileCircled />
                Members
              </NavMenuLink>
            </NavMenuItem>
          </NavMenuList>
        </NavigationMenu.Root>
      </SidebarSection>
      <Divider />

      <ComponentsList />
      <SidebarFooter></SidebarFooter>
    </SidebarMain>
  );
};

export default SidebarComponents;

const ComponentsList = ({}) => {
  const router = useRouter();
  const { system, component } = router.query;

  const [components, setComponents] = useState([]);

  const { data, error } = useSWR(
    `http://localhost:3000/api/design-systems/${system}`
  );

  useEffect(() => {
    if (data) {
      setComponents(data);
    }
  }, [data]);

  if (error) {
    return <p>Design Systems</p>;
  }
  if (!data) return "";

  // function that filters components by name when user types in search bar
  const filterComponents = (e) => {
    // sort data by title and filter by search input value (case insensitive) and return new array of filtered components
    const filteredComponents = data
      .sort((a, b) => a.title.localeCompare(b.title))
      .filter((componentItem: any) => {
        return (
          componentItem.title
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) > -1
        );
      });

    setComponents(filteredComponents);
  };

  return (
    <>
      <SidebarSection>
        <Subheader>
          Components ({components.length})
          <Button small>
            <Plus />
          </Button>
        </Subheader>
      </SidebarSection>

      <SidebarSection>
        <SearchInput>
          <Input
            id="search-components"
            placeholder="Search..."
            onChange={filterComponents}
          />

          <Search />
        </SearchInput>
      </SidebarSection>
      <ScrollAreaRoot>
        <ScrollAreaViewport>
          <SidebarSection>
            <NavigationMenu.Root>
              <NavMenuList>
                {components.length > 0 ? (
                  components
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((componentItem: any) => {
                      return (
                        <NavMenuItem key={componentItem.id}>
                          <NavMenuLink
                            href={`/design-system/${system}/component/${componentItem?.id}`}
                            active={component == componentItem.id}
                          >
                            {capitalizeFirstLetter(componentItem.title)}
                          </NavMenuLink>
                        </NavMenuItem>
                      );
                    })
                ) : data.length === 0 ? (
                  <Flex>
                    <SearchMessage>
                      No components found. Create a new component to get
                      started.
                    </SearchMessage>
                  </Flex>
                ) : (
                  <Flex>
                    <SearchMessage>
                      No components found. Try searching for a different term.
                    </SearchMessage>
                  </Flex>
                )}
              </NavMenuList>
            </NavigationMenu.Root>
          </SidebarSection>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="vertical">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaScrollbar orientation="horizontal">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner />
      </ScrollAreaRoot>
    </>
  );
};

const FDDropDown = ({ id, ds, system, children }: any) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { mutate } = useSWRConfig();

  const deleteDesignSystem = async () => {
    try {
      // Delete Design System
      const { error } = await supabaseClient
        .from("design_system")
        .delete()
        .eq("id", system);

      mutate(`http://localhost:3000/api/design-systems/getAllDesignSystems`);
      router.push(`/`);

      if (error)
        throw {
          error,
        };
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenuContent>
          <EditDesignSystemDialog>
            <DropdownMenuItemStale>
              Edit<RightSlot>⌘+E</RightSlot>
            </DropdownMenuItemStale>
          </EditDesignSystemDialog>

          <DropdownMenuItem>
            View Figma
            <RightSlot>
              <OpenNewWindow width={14} />
            </RightSlot>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownDescription>
            <small>Created by: {JSON.stringify(ds?.created_by, null, 2)}</small>
            <small>
              Created at: {JSON.stringify(ds?.created_at, null, 2)}
            </small>{" "}
          </DropdownDescription>
          <DropdownMenuSeparator />
          <DropdownMenuItemDestructive onClick={deleteDesignSystem}>
            Delete <RightSlot destructive>⌘+del</RightSlot>
          </DropdownMenuItemDestructive>
        </DropdownMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const SearchMessage = styled("span", {
  color: "$gray9",
  fontSize: "$fontSizes$1",
  margin: 0,
  padding: "$4 $2",
  textAlign: "center",
  width: "100%",
});

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

const contentStyles = {
  minWidth: 240,
  border: "1px solid $gray5",
  backgroundColor: "white",
  borderRadius: 6,
  padding: 6,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
};

const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);

const itemStyles = {
  all: "unset",
  fontSize: 14,
  lineHeight: 1,
  color: "$gray12",
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  height: 36,
  padding: "0 4px",
  position: "relative",
  paddingLeft: 8,
  userSelect: "none",
  cursor: "pointer",

  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },

  "&[data-highlighted]": {
    backgroundColor: "$gray4",
    color: "$gray12",
  },
};

const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
const DropdownMenuItemStale = styled("div", itemStyles, {
  "&:hover": {
    backgroundColor: "$gray4",
    color: "$gray12",
  },
});
const DropdownMenuItemDestructive = styled(DropdownMenu.Item, {
  ...itemStyles,
  color: red.red11,

  "&[data-highlighted]": {
    backgroundColor: red.red3,
  },
});

const DropdownMenuLabel = styled(DropdownMenu.Label, {
  paddingLeft: 25,
  fontSize: 12,
  lineHeight: "25px",
  color: mauve.mauve11,
});

const DropdownMenuSeparator = styled(DropdownMenu.Separator, {
  height: 1,
  backgroundColor: "$gray4",
  margin: 6,
});

const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 16,
  paddingRight: 4,
  color: "$gray11",
  fontSize: "12px",
  variants: {
    destructive: {
      true: { color: red.red11 },
    },
  },
});

const DropdownDescription = styled("div", {
  padding: 8,
  fontSize: 12,
  lineHeight: 1.5,
  color: "$gray11",
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const ScrollAreaRoot = styled(ScrollArea.Root, {
  height: "calc(100% - 300px)",
  overflow: "hidden",
});

const ScrollAreaViewport = styled(ScrollArea.Viewport, {
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
});

const ScrollAreaScrollbar = styled(ScrollArea.Scrollbar, {
  display: "flex",
  // ensures no selection
  userSelect: "none",
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: "none",
  padding: 2,
  transition: "background 160ms ease-out",
  '&[data-orientation="vertical"]': { width: 10 },
  '&[data-orientation="horizontal"]': {
    flexDirection: "column",
    height: 10,
  },
});

const ScrollAreaThumb = styled(ScrollArea.Thumb, {
  flex: 1,
  background: "$gray8",
  borderRadius: 10,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    minWidth: 44,
    minHeight: 44,
  },
});

const ScrollAreaCorner = styled(ScrollArea.Corner, {
  background: "blue",
});
