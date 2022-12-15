import { styled } from "../../stitches.config";

export const H1 = styled("h1", {
  fontSize: "$fontSizes$7",
  fontWeight: 700,

  color: "$gray12",
  letterSpacing: "-1px",
});

export const H2 = styled("h2", {
  fontSize: "$fontSizes$6",
  fontWeight: 700,

  color: "$gray12",
  letterSpacing: "-1px",
});

export const H3 = styled("h2", {
  fontSize: "$fontSizes$5",
  fontWeight: 700,
  color: "$gray12",
  letterSpacing: "-1px",
});

export const H4 = styled("h2", {
  fontSize: "$fontSizes$4",
  fontWeight: 700,
  color: "$gray12",
});

export const Subtitle = styled("p", {
  fontSize: "$fontSizes$3",

  color: "$gray11",
});

export const P = styled("p", {
  fontSize: "$fontSizes$2",
  lineHeight: "1.3rem",
  color: "$gray12",

  variants: {
    apprance: {
      secondary: {
        color: "$gray11",
      },
    },
  },
});

export const Caption = styled("p", {
  textTransform: "uppercase",
  letterSpacing: "0.04rem",
  fontSize: "10.5px",
  fontWeight: "600",
  color: "$gray10",
});
