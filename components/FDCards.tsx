import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Svg3DSelectFace,
  Lock,
  MoreHorizCircledOutline,
  MoreHoriz,
} from "iconoir-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import { styled } from "../stitches.config";

import { DesignSystemData } from "../types";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./DropdownMenu";
import FDSystemIcon from "./FDSystemIcon";

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
      fontSize: "14px",
      color: "$gray11",
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

const Cover = styled("div", {
  background: "$gray4",
  height: "48px",
  display: "block",

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
        backgroundColor: "$violet4",
      },
    },
    {
      color: "green",
      css: {
        backgroundColor: "$green4",
      },
    },
  ],
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
        <div className="tag">
          <Lock width={14} /> Private
        </div>
      </div>
      <DesignSystemCardDropdown id={system.id}>
        <IconButton>
          <MoreHoriz width={18} />
        </IconButton>
      </DesignSystemCardDropdown>
      {/* <FDDropdownMenu id={system.id} /> */}
    </Card>
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

const DesignSystemCardDropdown = ({ children, id }) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { mutate } = useSWRConfig();

  const DELETE_DESIGN_SYSTEM = async () => {
    try {
      // Delete Design System
      const { error } = await supabaseClient
        .from("design_system")
        .delete()
        .eq("id", id);

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent size="md" collisionPadding={{ right: 24 }}>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Go to Figma</DropdownMenuItem>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem onClick={DELETE_DESIGN_SYSTEM} destructive>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// COMPONENT

export const FDComponentCards = () => {
  return <div>Cards</div>;
};
