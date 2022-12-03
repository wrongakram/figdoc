import type { ReactElement } from "react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { styled, keyframes } from "../../stitches.config";
import Link from "next/link";

import React from "react";
import { violet, mauve, blackA, green } from "@radix-ui/colors";
import { gray } from "@radix-ui/colors/types/dark/gray";
import { Cancel, Check } from "iconoir-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import FDAvatar from "../avatar";

const Profile = ({ children }: any) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  async function signout() {
    const { error } = await supabaseClient.auth.signOut();
    router.push("/");
  }

  const initialState = {
    title: "",
    description: "",
    figma_file_key: "",
    theme: "",
  };

  const [designSystemData, setDesignSystemData] = useState(initialState);

  const handleChange = (e: any) => {
    setDesignSystemData({ ...designSystemData, [e.target.id]: e.target.value });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay className="DialogOverlay" />
        <DialogContent className="DialogContent">
          <DialogTitle className="DialogTitle">Profile</DialogTitle>
          <div className="inner">
            <Flex
              css={{
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                backgroundColor: "$gray3",
                padding: "24px 16px",
                borderRadius: 20,
              }}
            >
              <Flex
                css={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <FDAvatar
                  size={"xLg"}
                  img={user?.user_metadata.avatar_url}
                  title={"Akram"}
                />
                <div>
                  <Heading5>{user?.user_metadata.full_name}</Heading5>
                  <Subtitle>{user?.user_metadata.email}</Subtitle>
                </div>
              </Flex>
              <Button onClick={signout}>Sign out</Button>
            </Flex>

            <Divider />
            <div style={{ marginBottom: 32 }}>
              <SectionHeader>Figma access</SectionHeader>
              <Paragraph css={{ paddingTop: 4 }}>
                Insert your figma token to gain access component props and auto
                import. Learn how to find your
                <a href="https://www.figma.com/developers/api">Access Token.</a>
                Or watch our
                <a href="https://www.figma.com/developers/api">Video guide</a>
              </Paragraph>
            </div>
            <Fieldset className="Fieldset">
              <Label className="Label" htmlFor="figma_token">
                Figma Token
              </Label>
              <Input
                className="Input"
                name="figma_token"
                id="figma_token"
                placeholder="figd_iAjz5jxSgXD0N-3S1w_9iMNBv1KdYhUZHa8cDGAF"
                onChange={handleChange}
              />
            </Fieldset>

            <Divider />

            <div style={{ marginBottom: 32 }}>
              <SectionHeader>Delete account</SectionHeader>
              <Paragraph css={{ padding: "4px 0 12px 0" }}>
                Once any of the changes below are made we cannot undo them.
              </Paragraph>
              <Button danger onClick={() => {}}>
                Delete account
              </Button>
            </div>

            <Dialog.Close asChild>
              <IconButton className="IconButton" aria-label="Close">
                <Cancel />
              </IconButton>
            </Dialog.Close>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Profile;

const Heading5 = styled("h5", {
  color: "$gray12",
  margin: 0,
  fontSize: 18,
  lineHeight: 1.25,
});

const Paragraph = styled("p", {
  color: "$gray11",
  fontSize: 14,
  lineHeight: 1.25,
  a: {
    color: "$blue11",
    textDecoration: "underline",
    padding: "0 4px",
  },
});

const SectionHeader = styled("h6", {
  color: "$gray12",
  fontSize: 16,
  margin: 0,
});

const Subtitle = styled("span", {
  color: "$gray11",
  fontSize: 14,
});

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: blackA.blackA9,
  position: "fixed",
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(Dialog.Content, {
  backgroundColor: "$gray1",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "560px",
  maxHeight: "85vh",
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  overflow: "hidden",
  "&:focus": { outline: "none" },

  ".inner": {
    padding: 16,
  },
});

const DialogTitle = styled(Dialog.Title, {
  fontWeight: 700,
  color: "$gray12",
  fontSize: 20,
  height: 56,
  display: "flex",
  alignItems: "center",

  padding: "16px",
  borderBottom: "1px soild $gray6",
});

const DialogDescription = styled(Dialog.Description, {
  margin: "0 0 24px",
  color: "$gray11",
  fontSize: 14,
  lineHeight: 1.5,
});

const Divider = styled("div", {
  padding: "24px 0px",
  width: "100%",

  "&::before": {
    content: ``,
    display: "block",
    height: "1px",
    background: "$gray5",
  },
});

const Flex = styled("div", { display: "flex" });

const Button = styled("button", {
  background: "$gray5",
  fontSize: "14px",
  height: "44px",
  padding: "0 16px",
  borderRadius: "6px",
  color: "$gray12",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontWeight: 500,
  cursor: "pointer",

  "&:hover": {
    background: "$gray6",
  },

  variants: {
    danger: {
      true: {
        background: "$red3",
        color: "$red11",

        "&:hover": {
          background: "$red4",
        },
      },
    },
  },
});

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 32,
  width: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray11",
  position: "absolute",
  top: 12,
  right: 12,

  "&:hover": { backgroundColor: "$gray3" },
  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
});

const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 15,
  boxSizing: "border-box",
});

const Label = styled("label", {
  fontSize: 12,
  fontWeight: "600",
  display: "inline",
  color: "$gray10",
  textTransform: "uppercase",
  letterSpacing: ".75px",
});

const Input = styled("input", {
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
    boxShadow: `0 0 0 3px ${violet.violet8}`,
  },
});

const RadioGroupItem = styled(RadioGroup.Item, {
  all: "unset",
  width: 28,
  height: 28,
  borderRadius: "100%",
  border: "solid 2px $gray1",
  '&[data-state="unchecked"]': {},

  '&[data-state="checked"]': {
    boxShadow: `0 0 0px 2px black`,
  },

  //   "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
  variants: {
    theme: {
      gray: {
        background: "$gray9",
      },
      green: {
        background: "$green9",
      },
      violet: {
        background: "$violet9",
      },
      orange: {
        background: "$orange9",
      },
      blue: {
        background: "$blue9",
      },
      pink: {
        background: "$pink9",
      },
    },
  },
});

const RadioGroupIndicator = styled(RadioGroup.Indicator, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  position: "relative",

  variants: {
    theme: {
      gray: {
        background: "$gray4",
        color: "$gray12",
      },
      green: {
        background: "$green4",
        color: "$green12",
      },
      violet: {
        background: "$violet4",
        color: "$violet12",
      },
    },
  },
});
