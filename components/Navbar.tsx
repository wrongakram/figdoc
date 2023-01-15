import React from "react";
import { styled } from "@stitches/react";
import { blue } from "@radix-ui/colors";
import { Lock, LockKey, MoreHorizCircledOutline, NoLock } from "iconoir-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./DropdownMenu";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { mutate } from "swr";
import { Button } from "./FDButton";
import _ from "lodash";

const ComponentDropdown = ({ children, data }) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { system, component } = router.query;

  const DELETE_COMPONENT = async () => {
    try {
      // Delete Design System
      const { error } = await supabaseClient
        .from("component")
        .delete()
        .eq("id", component);

      mutate(`/api/design-systems/${system}`);
      router.push(`/design-system/${system}`);

      if (error)
        throw {
          error,
        };
    } catch (error: any) {
      console.log(error);
    }
  };

  const goToFigmaFile = (e: React.MouseEvent, figmaDetails: string) => {
    e.preventDefault();
    window.open(`https://www.figma.com/file/${figmaDetails}`, "_blank");
  };

  console.log(data);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent size="lg" collisionPadding={{ right: 24 }}>
        <DropdownMenuItem
          onClick={(e) =>
            goToFigmaFile(
              e,
              _.trim(
                data.component[0].figma_url,
                "https://www.figma.com/embed?embed_host=astra&url="
              )
            )
          }
        >
          Go to Figma
        </DropdownMenuItem>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem onClick={DELETE_COMPONENT} destructive>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = ({ data, setShowFigmaProps, showFigmaProps }: any) => {
  return (
    <NavContainer>
      <Breadcrumb>
        <BreadcrumbItem href={`/design-system/${data.id}`}>
          {data.title}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem active href="/">
          {data.component[0].title || "Untitled"}
        </BreadcrumbItem>
      </Breadcrumb>

      <NavActions>
        <ComponentDropdown data={data}>
          <IconButton>
            <MoreHorizCircledOutline width={18} />
          </IconButton>
        </ComponentDropdown>
      </NavActions>
    </NavContainer>
  );
};

const NavContainer = styled("div", {
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  borderBottom: "1px solid $gray3",
});

const Breadcrumb = styled("div", {
  display: "flex",
  alignItems: "center",
});
const BreadcrumbItem = styled(Link, {
  fontSize: 14,
  color: "$gray11",
  padding: "4px 8px",
  borderRadius: 6,
  cursor: "pointer",
  textTransform: "capitalize",

  "&:hover": {
    backgroundColor: "$gray3",
  },
  variants: {
    active: {
      true: {
        color: "$gray12",
        fontWeight: 500,
        "&:hover": {
          backgroundColor: "transparent",
          cursor: "default",
        },
      },
    },
  },
});
const BreadcrumbSeparator = styled("div", {
  color: "$gray11",
  fontSize: 14,
  "&:after": {
    content: "/",
  },
});

const NavActions = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: 2,
});

const SaveMessage = styled("span", {
  fontSize: 14,
  color: "$gray9",
});

const IconButton = styled("button", {
  borderRadius: 6,
  height: 36,
  width: 36,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray11",

  "&:hover": { backgroundColor: "$gray3" },
  "&:focus": { boxShadow: `0 0 0 2px ${blue.blue7}` },
});

export default Navbar;
