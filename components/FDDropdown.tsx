import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { MoreHoriz } from "iconoir-react";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { styled, keyframes } from "../stitches.config";

const FDDropDown = ({ id }: any) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const deleteDesignSystem = async () => {
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton aria-label="Customise options">
          <MoreHoriz width={20} />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Edit<RightSlot>⌘+N</RightSlot>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Duplicate<RightSlot>⌘+N</RightSlot>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItemDestructive onClick={deleteDesignSystem}>
            Delete <RightSlot destructive>⌘+del</RightSlot>
          </DropdownMenuItemDestructive>
        </DropdownMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
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

const contentStyles = {
  minWidth: 180,
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

  "&[data-highlighted]": {
    backgroundColor: "$gray4",
    color: "$gray12",
  },
};

const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
const DropdownMenuItemDestructive = styled(DropdownMenu.Item, {
  ...itemStyles,
  color: "$red11",

  "&[data-highlighted]": {
    backgroundColor: "$red3",
  },
});

const DropdownMenuLabel = styled(DropdownMenu.Label, {
  paddingLeft: 25,
  fontSize: 12,
  lineHeight: "25px",
  color: "$gray11",
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
      true: { color: "$red11" },
    },
  },
});

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
