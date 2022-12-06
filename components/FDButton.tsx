import React from "react";
import { styled, keyframes } from "../stitches.config";

export const Button = styled("button", {
  cursor: "pointer",
  background: "$gray12",
  color: "$gray1",

  fontSize: "$2",
  height: 44,

  padding: "0 12px",
  borderRadius: 6,

  display: "flex",
  alignItems: "center",
  gap: 4,

  "&:focus": {
    outline: "2px solid $violet9",
  },

  variants: {
    size: {
      small: {
        fontSize: "$1",
        height: 36,
        padding: "0 12px",
        svg: {
          width: 14,
        },
      },
      medium: {
        fontSize: "$2",
        height: 44,
        svg: {
          width: 20,
        },
      },
      large: {
        fontSize: "$3",
        height: 56,
      },
    },
    apperance: {
      primary: {
        background: "$gray12",
        color: "$gray1",
      },
      secondary: {
        background: "$gray4",
        color: "$gray12",
      },
      ghost: {
        background: "transparent",
        color: "$gray11",
        "&:hover": {
          background: "$gray3",
        },
        "&:focus": {
          background: "$gray3",
          outline: "2px solid $violet9",
        },
      },
    },
  },
});
