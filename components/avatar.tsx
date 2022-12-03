import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { styled } from "../stitches.config";

const FDAvatar = ({ title, img, size }: any) => {
  return (
    <AvatarRoot size={size}>
      <AvatarImage className="AvatarImage" src={img} alt={title + " Image"} />
      <AvatarFallback className="AvatarFallback" delayMs={600}>
        {title.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </AvatarRoot>
  );
};

export default FDAvatar;

const AvatarRoot = styled(Avatar.Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  width: "28px",
  height: "28px",
  borderRadius: "100px",
  backgroundColor: "var(--blackA3)",

  variants: {
    size: {
      lg: {
        width: "40px",
        height: "40px",
      },
      xLg: {
        width: "60px",
        height: "60px",
      },
    },
  },
});

const AvatarImage = styled(Avatar.Image, {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "inherit",
});
const AvatarFallback = styled(Avatar.Fallback, {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--violet2)",
  color: "var(--violet11)",
  fontSize: "14px",
  lineHeight: "1",
  fontWeight: "600",
});
