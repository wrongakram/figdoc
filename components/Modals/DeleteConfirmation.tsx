import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { styled, keyframes } from "@stitches/react";
import { violet, blackA, red, mauve } from "@radix-ui/colors";
import { Button } from "../FDButton";

const DeleteConfirmation = ({
  title,
  delFunc,
  description,
  primaryButtonText,
}: any) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <Flex css={{ width: "100%", height: "100%", alignItems: "center" }}>
        {primaryButtonText}
      </Flex>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <Flex css={{ justifyContent: "center", gap: 8 }}>
          <AlertDialog.Cancel asChild>
            <Button apperance={"ghost"}>Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button onClick={delFunc} apperance={"destructive"}>
              Yes, {primaryButtonText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialogContent>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const AlertDialogOverlay = styled(AlertDialog.Overlay, {
  backgroundColor: blackA.blackA9,
  position: "fixed",
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const AlertDialogContent = styled(AlertDialog.Content, {
  backgroundColor: "white",
  borderRadius: 20,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "360px",
  maxHeight: "85vh",
  padding: "32px ",
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  textAlign: "center",

  "&:focus": { outline: "none" },
});

const AlertDialogTitle = styled(AlertDialog.Title, {
  fontWeight: 700,
  color: "$gray12",
  fontSize: 16,
});

const AlertDialogDescription = styled(AlertDialog.Description, {
  margin: "8px 0 40px",
  color: "$gray11",
  fontSize: 14,
  lineHeight: 1.5,
});

const Highlight = styled("span", {
  padding: 6,
  background: "$gray3",
  color: "$gray12",
  borderRadius: 6,
  fontFamily: "SF Mono, monospace, sans-serif, serif",
  fontWeight: 500,
  marginLeft: 4,
  fontSize: 14,
});

const Flex = styled("div", { display: "flex" });

export default DeleteConfirmation;
