import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import * as Toast from "@radix-ui/react-toast";

import { styled, keyframes } from "@stitches/react";

import { Cancel } from "iconoir-react";

const FDToast = ({ title, content, children, ...props }) => {
  return (
    <>
      <ToastRoot {...props}>
        {title && <ToastTitle>{title}</ToastTitle>}
        <ToastDescription>{content}</ToastDescription>
        {/* {children && <ToastAction asChild>{children}</ToastAction>} */}
        <ToastPrimitive.Close aria-label="Close">
          <Cancel width={20} />
        </ToastPrimitive.Close>
      </ToastRoot>
      <ToastViewport />
    </>
  );
};

const VIEWPORT_PADDING = 25;

const ToastViewport = styled(Toast.Viewport, {
  position: "fixed",
  bottom: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  padding: VIEWPORT_PADDING,
  gap: 10,
  width: 390,
  maxWidth: "100vw",
  margin: 0,
  listStyle: "none",
  zIndex: 2147483647,
  outline: "none",
});

const hide = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: "translateX(0)" },
});

const swipeOut = keyframes({
  from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const ToastRoot = styled(ToastPrimitive.Root, {
  backgroundColor: "white",
  borderRadius: 8,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  padding: 16,
  display: "grid",
  gridTemplateAreas: '"title action" "description action"',
  gridTemplateColumns: "auto max-content",
  columnGap: 12,
  alignItems: "center",

  '&[data-state="open"]': {
    animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${hide} 100ms ease-in`,
  },
  '&[data-swipe="move"]': {
    transform: "translateX(var(--radix-toast-swipe-move-x))",
  },
  '&[data-swipe="cancel"]': {
    transform: "translateX(0)",
    transition: "transform 200ms ease-out",
  },
  '&[data-swipe="end"]': {
    animation: `${swipeOut} 100ms ease-out`,
  },
});

const ToastTitle = styled(ToastPrimitive.Title, {
  gridArea: "title",
  marginBottom: 4,
  fontWeight: 600,
  color: "$gray12",
  fontSize: 14,
});

const ToastDescription = styled(ToastPrimitive.Description, {
  gridArea: "description",
  color: "$gray11",
  fontSize: 12,
  lineHeight: 1.15,
});

const ToastAction = styled(ToastPrimitive.Action, {
  gridArea: "action",
});

export default FDToast;
