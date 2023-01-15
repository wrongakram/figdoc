import React, { useEffect, useState } from "react";
import { styled, keyframes } from "../stitches.config";
import useSWR, { useSWRConfig } from "swr";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { violet, mauve, red } from "@radix-ui/colors";

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
  ColorFilter,
} from "iconoir-react";
import EditDesignSystemDialog from "./Modals/EditDesignSystem";
import { capitalizeFirstLetter } from "../utils/functions/capitalizeFirstLetter";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import _ from "lodash";
import { Flex } from "./primitives/structure";
import moment from "moment";
import DeleteConfirmation from "./Modals/DeleteConfirmation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuItemStale,
  RightSlot,
  DropdownMenuItemButton,
} from "./DropdownMenu";
import CreateComponent from "./Modals/CreateComponent";

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
  borderRight: "1px solid $gray3",

  color: "$gray12",
  left: 0,
  width: "228px",
  height: "100%",
});

const SidebarHeader = styled("div", {
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 12px 0 16px",
  fontSize: "14px",
  gap: 12,
  cursor: "pointer",
  borderBottom: "1px solid $gray3",
  marginBottom: 8,
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
    fontSize: 14,
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
  border: "solid 1px $gray3",

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
              <span>{ds?.figma_file_key}</span>
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
            <NavMenuItem>
              <NavMenuLink
                href={`/design-system/${system}/styles`}
                active={path === `/design-system/${system}/styles`}
              >
                <ColorFilter />
                Styles
              </NavMenuLink>
            </NavMenuItem>
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

const ComponentsList = () => {
  const router = useRouter();
  const { system, component } = router.query;

  const [components, setComponents] = useState([]);

  const { data, error } = useSWR(`/api/design-systems/${system}`);

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
          <CreateComponent>
            <Button small>
              <Plus />
            </Button>
          </CreateComponent>
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
                            {capitalizeFirstLetter(
                              componentItem.title || "Untitled"
                            )}
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
  const user = useUser();

  const LEAVE_DESIGN_SYSTEM = async () => {
    try {
      // Delete Member
      const { error } = await supabaseClient
        .from("members")
        .delete()
        .eq("user_id", user?.id);

      mutate(`/api/design-systems/getAllDesignSystems`);
      router.push(`/`);

      if (error)
        throw {
          error,
        };
    } catch (error: any) {
      console.log(error);
    }
  };

  const DELETE_DESIGN_SYSTEM = async () => {
    try {
      // Delete Design System
      const { error } = await supabaseClient
        .from("design_system")
        .delete()
        .eq("id", ds?.id);

      mutate(`/api/design-systems/getAllDesignSystems`);
      router.push(`/`);

      if (error)
        throw {
          error,
        };
    } catch (error: any) {
      console.log(error);
    }
  };

  const goToFigmaFile = (e: React.MouseEvent, figmaFileKey: string) => {
    e.preventDefault();
    window.open(`https://www.figma.com/file/${figmaFileKey}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <EditDesignSystemDialog>
          <DropdownMenuItemStale>
            Edit<RightSlot>⌘+E</RightSlot>
          </DropdownMenuItemStale>
        </EditDesignSystemDialog>
        <DropdownMenuItem onClick={(e) => goToFigmaFile(e, ds?.figmaFileKey)}>
          Go to Figma
          <RightSlot>
            <OpenNewWindow width={14} />
          </RightSlot>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownDescription>
          <small>Created by: {ds?.created_by_email}</small>
          <small>
            Created on: {moment(ds?.created_at).add(24, "hours").format("LLL")}
          </small>
        </DropdownDescription>{" "}
        {ds?.created_by == user?.id ? (
          <>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem onClick={(e) => e.preventDefault()} destructive>
              <DeleteConfirmation
                title={`Delete ${ds?.title}?`}
                titleHighlight={ds?.title}
                description={`This will delete the ${ds?.title} Design System and all of its components. This action cannot be undone.`}
                delFunc={DELETE_DESIGN_SYSTEM}
                primaryButtonText="Delete"
              />
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem onClick={(e) => e.preventDefault()} destructive>
              <DeleteConfirmation
                title={`Leave ${ds?.title}?`}
                titleHighlight={ds?.title}
                description={`This will remove you from the ${ds?.title} Design System. You will no longer be able to access it.`}
                delFunc={LEAVE_DESIGN_SYSTEM}
                primaryButtonText="Leave"
              />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
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

// const DropdownMenuSeparator = styled(DropdownMenu.Separator, {
//   height: 1,
//   backgroundColor: "$gray4",
//   margin: 6,
// });

// const RightSlot = styled("div", {
//   marginLeft: "auto",
//   paddingLeft: 16,
//   paddingRight: 4,
//   color: "$gray11",
//   fontSize: "12px",
//   variants: {
//     destructive: {
//       true: { color: red.red11 },
//     },
//   },
// });

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
