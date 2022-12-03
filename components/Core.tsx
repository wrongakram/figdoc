import React from "react";
import { styled, keyframes } from "../stitches.config";
import Link from "next/link";

export const Page = styled("div", {
  padding: "32px 80px",
  overflow: "scroll",
  maxWidth: "1140px",
  margin: "0 auto",
});

export const PageHeader = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
  marginTop: "$8",
});

export const PageTitle = styled("h1", {
  fontSize: "$fontSizes$6",
  display: "flex",
  alignItems: "center",
  color: "$gray12",
  letterSpacing: "-1px",
});

export const PageDescription = styled("span", {
  fontSize: "$fontSizes$3",
  display: "flex",
  alignItems: "center",
  color: "$gray11",
});

export const PageGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(auto, 1fr)",
  gridColumnGap: "32px",
  gridRowGap: "32px",
});

export const Card = styled(Link, {
  borderRadius: "6px",
  border: "solid 1px $gray6",
  position: "relative",
  overflow: "hidden",
  paddingBottom: "48px",
  "&:hover": {
    border: "solid 1px $gray8",
  },

  ".cover": {
    background: "$gray2",
    height: "160px",
    display: "block",
    padding: 48,
    ".img": {
      height: "100%",
      position: "relative",
      display: "block",
    },
  },

  ".avatar": {
    position: "absolute",
    left: "16px",
    top: "24px",
  },

  ".content": {
    marginTop: "12px",
    padding: "16px",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    ".title": {
      fontSize: "16px",
      fontWeight: "600",
      color: "$gray12",
    },

    ".description": {
      fontSize: "14px",
      color: "$gray11",
    },
  },

  ".tags-container": {
    position: "absolute",
    bottom: "16px",
    left: "16px",
    ".tag": {
      border: "solid 1px $gray6",
      borderRadius: "100px",
      fontSize: "12px",
      color: "$gray11",
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
      height: "28px",
    },
  },
});
