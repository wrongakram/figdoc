import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  Svg3DSelectFace,
  Lock,
  MoreHorizCircledOutline,
  MoreHoriz,
  ProfileCircled,
  OpenNewWindow,
} from "iconoir-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { styled } from "../stitches.config";

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
import FDSystemIcon from "./FDSystemIcon";
import DeleteConfirmation from "./Modals/DeleteConfirmation";
import EditDesignSystemDialog from "./Modals/EditDesignSystem";

const Card = styled(Link, {
  borderRadius: "6px",
  border: "solid 1px $gray6",
  position: "relative",
  overflow: "hidden",
  paddingBottom: "48px",
  "&:hover": {
    border: "solid 1px $gray8",
  },

  ".content": {
    marginTop: "12px",
    padding: "16px",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    ".title": {
      fontSize: "16px",
      fontWeight: "600",
      color: "$gray12",
    },

    ".description": {
      fontSize: "$2",
      color: "$gray11",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": 2,
      overflow: "hidden",
      lineHeight: "1.3rem",
    },
  },

  ".tags-container": {
    position: "absolute",
    bottom: "16px",
    left: "16px",
    ".tag": {
      border: "solid 1px $gray6",
      borderRadius: "100px",
      fontSize: "12px",
      color: "$gray11",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "0 8px",
      height: "28px",
      svg: {},
    },
  },
});

const SystemAvatar = styled("div", {
  position: "absolute",
  left: "16px",
  top: "28px",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  color: "$gray11",
  backgroundColor: "$gray3",

  variants: {
    color: {
      violet: {},
      green: {},
    },
  },

  compoundVariants: [
    {
      color: "violet",
      css: {
        color: "$violet11",
        backgroundColor: "$violet3",
      },
    },
    {
      color: "green",
      css: {
        color: "$green11",
        backgroundColor: "$green3",
      },
    },
  ],
});

type DesignSystem = {
  id: string;
  created_at: string;
  title: string;
  created_by: string;
  description: string | null;
  figma_file_key: string;
  theme: string;
};

export const FDDesignSystemCards = ({ system }: { system: DesignSystem }) => {
  return (
    <>
      <Card href={`/design-system/${system.id}`}>
        <Cover color={system.theme} />
        <div style={{ position: "absolute", left: "16px", top: "28px" }}>
          <FDSystemIcon theme={system.theme} />
        </div>
        <div className="content">
          <div className="title">{system.title}</div>
          <div className="description">{system.description}</div>
        </div>
        <div className="tags-container">
          {system.members.length > 1 ? (
            <div className="tag">
              <Label color={system.theme}>{system.members.length}</Label>{" "}
              Members
            </div>
          ) : (
            <div className="tag">
              <Lock width={14} /> Private
            </div>
          )}
        </div>
        <DesignSystemCardDropdown
          id={system.id}
          owner={system.created_by}
          title={system.title}
          figmaFileKey={system.figma_file_key}
        >
          <IconButton>
            <MoreHoriz width={18} />
          </IconButton>
        </DesignSystemCardDropdown>
      </Card>
    </>
  );
};

const IconButton = styled("button", {
  position: "absolute",
  top: 6,
  right: 12,
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 36,
  width: 36,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray12",
  "&:hover": { backgroundColor: "rgba(100,100,100,.06)" },
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

const DesignSystemCardDropdown = ({
  children,
  id,
  owner,
  figmaFileKey,
  title,
}: any) => {
  const user = useUser();

  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { mutate } = useSWRConfig();

  const LEAVE_DESIGN_SYSTEM = async () => {
    try {
      // Delete Design System
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
        .eq("id", id);

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
      <DropdownMenuContent size="md" collisionPadding={{ right: 24 }}>
        {/* {owner == user?.id && (
          <EditDesignSystemDialog>
            <DropdownMenuItemStale>
              Edit<RightSlot>⌘+E</RightSlot>
            </DropdownMenuItemStale>
          </EditDesignSystemDialog>
        )} */}

        <DropdownMenuItem onClick={(e) => goToFigmaFile(e, figmaFileKey)}>
          Go to Figma
        </DropdownMenuItem>

        <DropdownMenuGroup>
          {owner == user?.id ? (
            <>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem onClick={(e) => e.preventDefault()} destructive>
                <DeleteConfirmation
                  title={`Delete ${title}?`}
                  titleHighlight={title}
                  description={`This will delete the ${title} Design System and all of its components. This action cannot be undone.`}
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
                  title={`Leave ${title}?`}
                  titleHighlight={title}
                  description={`This will remove you from the ${title} Design System. You will no longer be able to access it.`}
                  delFunc={LEAVE_DESIGN_SYSTEM}
                  primaryButtonText="Leave"
                />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const themeStyles = {
  variants: {
    color: {
      violet: {},
      green: {},
      blue: {},
      red: {},
      yellow: {},
      orange: {},
      pink: {},
    },
  },

  compoundVariants: [
    {
      color: "violet",
      css: {
        color: "$violet11",
        backgroundColor: "$violet4",
      },
    },
    {
      color: "green",
      css: {
        color: "$green11",
        backgroundColor: "$green4",
      },
    },
    {
      color: "blue",
      css: {
        color: "$blue11",
        backgroundColor: "$blue4",
      },
    },
    {
      color: "red",
      css: { color: "$red11", backgroundColor: "$red4" },
    },
    {
      color: "yellow",
      css: {
        color: "$yellow11",
        backgroundColor: "$yellow4",
      },
    },
    {
      color: "orange",
      css: {
        color: "$orange11",
        backgroundColor: "$orange4",
      },
    },
    {
      color: "pink",
      css: {
        color: "$pink11",
        backgroundColor: "$pink4",
      },
    },
  ],
};

const Label = styled("span", {
  ...themeStyles,
  background: "$violet4",
  color: "$violet11",
  height: 18,
  width: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
  borderRadius: 200,
  fontSize: 11,
  fontWeight: 500,
});

const Cover = styled("div", {
  ...themeStyles,
  background: "$gray4",
  height: "48px",
  display: "block",
});
