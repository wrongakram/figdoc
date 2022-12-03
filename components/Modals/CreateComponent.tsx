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

const CreateComponent = ({ children }: any) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { system } = router.query;

  const initialState = {
    title: "",
    description: "",
    figma_url: "",
  };

  const [componentData, setComponentData] = useState(initialState);

  const handleChange = (e: any) => {
    setComponentData({ ...componentData, [e.target.id]: e.target.value });
  };

  const createComponent = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("component")
        .insert([
          {
            title: componentData.title,
            description: componentData.description,
            figma_url:
              "https://www.figma.com/embed?embed_host=astra&url=" +
              componentData.figma_url,
            created_by: user?.id,
            design_system: system,
            documentation: [
              {
                type: "title",
                children: [{ text: componentData.title }],
              },
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
          },
        ])
        .single();

      if (error) throw error;

      setComponentData(initialState);

      router.reload();
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay className="DialogOverlay" />
        <DialogContent className="DialogContent">
          <DialogTitle className="DialogTitle">Create Component</DialogTitle>
          <div className="inner">
            <Fieldset className="Fieldset">
              <Label className="Label" htmlFor="title">
                Component Name
              </Label>
              <Input
                className="Input"
                name="title"
                id="title"
                placeholder="e.g. Button"
                onChange={handleChange}
              />
            </Fieldset>
            <Fieldset className="Fieldset">
              <Label className="Label" htmlFor="description">
                Description
              </Label>
              <Input
                className="Input"
                name="description"
                id="description"
                placeholder=""
                onChange={handleChange}
              />
            </Fieldset>
            <Fieldset className="Fieldset">
              <Label className="Label" htmlFor="figma_url">
                Figma URL
              </Label>
              <Input
                pattern="/https:\/\/([\w\.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/"
                className="Input"
                name="figma_url"
                id="figma_url"
                placeholder=""
                onChange={handleChange}
              />
            </Fieldset>

            <div
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}
            >
              <Dialog.Close asChild>
                <Button onClick={createComponent} className="Button green">
                  Create
                </Button>
              </Dialog.Close>
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

export default CreateComponent;
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
  maxWidth: "480px",
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
  fontSize: 16,
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

const Flex = styled("div", { display: "flex" });

const Button = styled("button", {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 15px",
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    variant: {
      violet: {
        backgroundColor: "white",
        color: violet.violet11,
        boxShadow: `0 2px 10px ${blackA.blackA7}`,
        "&:hover": { backgroundColor: mauve.mauve3 },
        "&:focus": { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: green.green4,
        color: green.green11,
        "&:hover": { backgroundColor: green.green5 },
        "&:focus": { boxShadow: `0 0 0 2px ${green.green7}` },
      },
    },
  },

  defaultVariants: {
    variant: "violet",
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
  gap: 4,
  marginBottom: 15,
  boxSizing: "border-box",
});

const Label = styled("label", {
  fontSize: 14,
  fontWeight: "500",
  display: "inline",
  color: "$gray11",
});

const Input = styled("input", {
  all: "unset",
  width: "100%",
  flex: "1",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  padding: "10px 12px",
  fontSize: 14,
  lineHeight: 1,
  color: "$gray12",
  border: "1px solid $gray7",
  boxSizing: "border-box",

  "&::placeholder": {
    color: "$gray9",
  },

  "&:focus": {
    boxShadow: `0 0 0 2px ${violet.violet8}`,
    border: "1px solid transparent",
  },
});

const RadioGroupRoot = styled(RadioGroup.Root, {
  display: "flex",
  gap: 8,
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
