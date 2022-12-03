import { violet } from "@radix-ui/colors";
import { styled } from "../../stitches.config";

export const Input = styled("input", {
  all: "unset",
  width: "100%",
  flex: "1",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  padding: "12px",
  maxHeight: 40,
  fontSize: 14,
  lineHeight: 1,
  color: "$gray12",
  backgroundColor: "$gray4",
  boxSizing: "border-box",

  "&::placeholder": {
    color: "$gray9",
  },

  "&:focus": {
    boxShadow: `0 0 0 6px ${violet.violet5}`,
    outline: "2px solid $violet9",
  },
});

export const Textarea = styled("textarea", {
  all: "unset",
  width: "100%",
  flex: "1",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  padding: "12px",
  fontSize: 14,
  lineHeight: 1,
  color: "$gray12",
  backgroundColor: "$gray4",
  boxSizing: "border-box",

  "&::placeholder": {
    color: "$gray10",
  },

  "&:focus": {
    boxShadow: `0 0 0 6px ${violet.violet5}`,
    outline: "2px solid $violet9",
  },
});

export const Required = styled("span", {
  color: "$red9",
  fontSize: 12,
});

export const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 20,
  boxSizing: "border-box",
});

export const Label = styled("label", {
  fontSize: 11,
  fontWeight: "600",
  display: "inline",
  color: "$gray11",
  textTransform: "uppercase",
  letterSpacing: ".875px",
});
