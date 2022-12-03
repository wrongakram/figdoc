import React from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { styled, keyframes } from "@stitches/react";
import { mauve } from "@radix-ui/colors";
import { InfoEmpty } from "iconoir-react";

import Image from "next/image";
import figmaFileKey from "../public/figmaFileKey.png";

const QuestionMarkContainer = styled("div", {
  position: "relative",
  width: 24,
  height: 24,
  color: "$gray11",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "$gray4",
  },
});

const FigmaPopoverGuide = () => (
  <HoverCard.Root openDelay={200}>
    <HoverCard.Trigger asChild>
      <QuestionMarkContainer>
        <InfoEmpty width={16} />
      </QuestionMarkContainer>
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCardContent side="right" sideOffset={8}>
        <Flex css={{ flexDirection: "column", gap: 7 }}>
          <div style={{ height: 188, marginBottom: 8 }}>
            <div style={{ height: "100%", position: "relative" }}>
              <Image
                src={figmaFileKey}
                alt="Figma Token"
                fill
                quality={100}
                style={{ borderRadius: 12 }}
              />
            </div>
          </div>
          <PopoverContent>
            To grab your figma file key simple copy the file key from the URL of
            your figma file.
          </PopoverContent>

          <PopoverContent>
            For example, if your figma file URL is https://www.figma.com/file/
            <b>1234567890</b>/My-Design-System?node-id=0%3A1, then your file key
            is <b>1234567890</b>.
          </PopoverContent>
        </Flex>
      </HoverCardContent>
    </HoverCard.Portal>
  </HoverCard.Root>
);

const PopoverContent = styled("span", {
  fontSize: "$2",
  color: "$gray11",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",

  b: {
    fontWeight: 500,
    color: "$gray12",
  },
});

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

const HoverCardContent = styled(HoverCard.Content, {
  borderRadius: 20,
  padding: 16,
  width: 300,
  boxSizing: "border-box",
  backgroundColor: "white",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});

const HoverCardArrow = styled(HoverCard.Arrow, {
  fill: "white",
});

const ImageTrigger = styled("a", {
  all: "unset",
  cursor: "pointer",
  borderRadius: "100%",
  display: "inline-block",
  "&:focus": { boxShadow: `0 0 0 2px white` },
});

const Img = styled("img", {
  display: "block",
  borderRadius: "100%",
  variants: {
    size: {
      normal: { width: 45, height: 45 },
      large: { width: 60, height: 60 },
    },
  },
  defaultVariants: {
    size: "normal",
  },
});

const Text = styled("div", {
  margin: 0,
  color: mauve.mauve12,
  fontSize: 15,
  lineHeight: 1.5,
  variants: {
    faded: {
      true: { color: mauve.mauve10 },
    },
    bold: {
      true: { fontWeight: 500 },
    },
  },
});

const Flex = styled("div", { display: "flex" });

export default FigmaPopoverGuide;
