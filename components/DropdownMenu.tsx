// your-dropdown-menu.jsx
import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { styled, keyframes } from "../stitches.config";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// eslint-disable-next-line react/display-name
export const DropdownMenuContent = React.forwardRef(
  ({ children, ...props }: any, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuContentStyles {...props} ref={forwardedRef}>
          {children}
        </DropdownMenuContentStyles>
      </DropdownMenuPrimitive.Portal>
    );
  }
);

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

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

export const contentStyles = {
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

  variants: {
    size: {
      lg: {
        minWidth: 240,
      },
      md: {
        minWidth: 180,
      },
    },
  },
};

const DropdownMenuContentStyles = styled(
  DropdownMenuPrimitive.Content,
  contentStyles
);

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
    color: "$gray8",
    pointerEvents: "none",
  },

  "&[data-highlighted]": {
    backgroundColor: "$gray4",
    color: "$gray12",
  },

  variants: {
    destructive: {
      true: {
        color: "$red11",

        "&[data-highlighted]": {
          backgroundColor: "$red3",
          color: "$red11",
        },
      },
    },
  },
};

export const DropdownMenuItem = styled(DropdownMenuPrimitive.Item, itemStyles);
export const DropdownMenuItemStale = styled("div", itemStyles, {
  "&:hover": {
    backgroundColor: "$gray4",
    color: "$gray12",
  },
});

export const DropdownMenuItemButton = styled("button", itemStyles, {});

export const DropdownMenuLabel = styled(DropdownMenuPrimitive.Label, {
  paddingLeft: 25,
  fontSize: 12,
  lineHeight: "25px",
  color: "$gray11",
});

export const DropdownMenuSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: "$gray4",
  margin: 6,
});

export const RightSlot = styled("div", {
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

export const DropdownDescription = styled("div", {
  padding: 8,
  fontSize: 12,
  lineHeight: 1.5,
  color: "$gray11",
  display: "flex",
  flexDirection: "column",
  gap: 4,
});
