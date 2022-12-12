import React from "react";
import { styled } from "@stitches/react";
import { blue } from "@radix-ui/colors";
import { MoreHorizCircledOutline } from "iconoir-react";
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

const ComponentDropdown = ({ children }) => {
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

      mutate(`http://localhost:3000/api/design-systems/${system}`);
      router.push(`/design-system/${system}`);

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
        <DropdownMenuItem>Go to Figma</DropdownMenuItem>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem onClick={DELETE_COMPONENT} destructive>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = ({ data }: any) => {
  return (
    <NavContainer>
      <Breadcrumb>
        <BreadcrumbItem href={`/design-system/${data.id}`}>
          {data.title}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem active href="/">
          {data.component[0].title}
        </BreadcrumbItem>
      </Breadcrumb>

      <NavActions>
        <ComponentDropdown>
          <IconButton>
            <MoreHorizCircledOutline width={18} />
          </IconButton>
        </ComponentDropdown>
      </NavActions>
    </NavContainer>
  );
};

const NavContainer = styled("div", {
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
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
  gap: 2,
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
