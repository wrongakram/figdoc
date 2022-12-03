import { Svg3DSelectFace } from "iconoir-react";
import React from "react";
import { styled } from "../stitches.config";

const FDSystemIcon = ({
  theme,
  size = "medium",
}: {
  theme: any;
  size?: any;
}) => {
  return (
    <SystemAvatar color={theme} size={size}>
      <Svg3DSelectFace width={20} />
    </SystemAvatar>
  );
};

export default FDSystemIcon;

const SystemAvatar = styled("div", {
  position: "relative",
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
      orange: {},
      blue: {},
      pink: {},
    },
    size: {
      medium: {
        width: 40,
        height: 40,
      },
      large: {
        width: 64,
        height: 64,
        borderRadius: 18,
        svg: {
          width: 28,
          height: 28,
        },
      },
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
    {
      color: "orange",
      css: {
        color: "$orange11",
        backgroundColor: "$orange3",
      },
    },
    {
      color: "blue",
      css: {
        color: "$blue11",
        backgroundColor: "$blue3",
      },
    },
    {
      color: "pink",
      css: {
        color: "$pink11",
        backgroundColor: "$pink3",
      },
    },
  ],
});
