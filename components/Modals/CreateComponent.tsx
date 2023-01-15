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

import {
  Input,
  Textarea,
  Label,
  Fieldset,
  Required,
} from "../primitives/forms";
import { Button } from "../FDButton";

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
            title: componentData.title || "Untitled",
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
                type: "description",
                children: [{ text: componentData.description }],
              },
              {
                type: "embed",
                url:
                  "https://www.figma.com/embed?embed_host=astra&url=" +
                  componentData.figma_url,
                children: [{ text: "" }],
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
                required
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
  borderRadius: 12,
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
    padding: "4px 20px 20px 20px",
  },
});

const DialogTitle = styled(Dialog.Title, {
  fontWeight: 700,
  color: "$gray12",
  fontSize: "$3",
  height: 64,
  display: "flex",
  alignItems: "center",
  padding: 20,
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
  top: 16,
  right: 16,

  "&:hover": { backgroundColor: "$gray3" },
  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
});
