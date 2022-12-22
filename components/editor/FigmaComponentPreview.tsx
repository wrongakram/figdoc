import { styled } from "@stitches/react";
import React from "react";

const FigmaPreviewFrame = styled("div", {
  height: "300px",
  iframe: { border: "1px solid $gray5", borderRadius: 12 },
});

const FigmaComponentPreview = ({ url }: any) => {
  return (
    <FigmaPreviewFrame>
      <iframe width="100%" height="100%" src={url}></iframe>
    </FigmaPreviewFrame>
  );
};

export default FigmaComponentPreview;
