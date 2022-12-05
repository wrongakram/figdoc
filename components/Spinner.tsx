import React from "react";
import { styled, keyframes } from "../stitches.config";

const Spinner = ({ color }) => {
  return <Spin color={color} />;
};

export default Spinner;

const rotation = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const Spin = styled("span", {
  width: "20px",
  height: "20px",
  border: "2.5px solid #FFF",
  borderBottomColor: "transparent",
  borderRadius: "50%",
  display: "inline-block",
  boxSizing: "border-box",
  animation: `${rotation} 1s linear infinite`,

  variants: {
    color: {
      black: {
        border: "2.5px solid $gray11",
        borderBottomColor: "transparent",
      },
    },
  },
});
