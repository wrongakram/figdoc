import { useContext, useState } from "react";

import { useRouter } from "next/router";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { styled, keyframes } from "../../stitches.config";
import Link from "next/link";

import React from "react";
import { violet, mauve, blackA, green } from "@radix-ui/colors";
import { gray } from "@radix-ui/colors/types/dark/gray";
import { Cancel, Check } from "iconoir-react";

// SWR
import { useSWRConfig } from "swr";

// Context
import ToastContext from "../../context/ToastContext";

// Radix
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Dialog from "@radix-ui/react-dialog";

// Components
import {
  Input,
  Textarea,
  Label,
  Fieldset,
  Required,
} from "../primitives/forms";

import Spinner from "../Spinner";
import FigmaPopoverGuide from "../FigmaPopoverGuide";
import { Button } from "../FDButton";
import FDSystemIcon from "../FDSystemIcon";

const CreateNewDesignSystemDialog = ({ children }: any) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const context = useContext(ToastContext);

  const { mutate } = useSWRConfig();

  const initialState = {
    title: "",
    description: "",
    figma_file_key: "",
    theme: "",
  };

  const [designSystemData, setDesignSystemData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleChange = (e: any) => {
    setDesignSystemData({ ...designSystemData, [e.target.id]: e.target.value });
  };

  const createDesignSystem = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabaseClient
        .from("design_system")
        .insert([
          {
            title: designSystemData.title,
            description: designSystemData.description,
            created_by: user?.id,
            figma_file_key: designSystemData.figma_file_key,
            theme: designSystemData.theme,
          },
        ])
        .select();

      if (data) {
        mutate(`http://localhost:3000/api/design-systems/getAllDesignSystems`);
        router.push(`/design-system/${data[0].id}`);
      }

      setOpen(false);
      setLoading(false);
      setDesignSystemData(initialState);
      context.setCreateDesignSystemToast(true);

      if (error) throw error;
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay className="DialogOverlay" />
        <DialogContent className="DialogContent">
          <DialogTitle className="DialogTitle">New Design System</DialogTitle>
          <div className="inner">
            <IconPreview>
              <FDSystemIcon theme={designSystemData.theme} size="large" />
            </IconPreview>
            <form onSubmit={createDesignSystem}>
              <Fieldset className="Fieldset">
                <RadioGroupRoot
                  onValueChange={(value: string) =>
                    setDesignSystemData({
                      ...designSystemData,
                      theme: value,
                    })
                  }
                  defaultValue={
                    designSystemData.theme === ""
                      ? "gray"
                      : designSystemData.theme
                  }
                  aria-label="Theme Color"
                >
                  <RadioGroupItem value="gray" theme="gray" id="r1">
                    <RadioGroupIndicator>
                      <Check color={"white"} width={18} strokeWidth={3} />
                    </RadioGroupIndicator>
                  </RadioGroupItem>

                  <RadioGroupItem value="violet" theme="violet" id="r2">
                    <RadioGroupIndicator>
                      <Check color={"white"} width={16} strokeWidth={3} />
                    </RadioGroupIndicator>
                  </RadioGroupItem>

                  <RadioGroupItem value="green" theme="green" id="r3">
                    <RadioGroupIndicator>
                      <Check color={"white"} width={16} strokeWidth={3} />
                    </RadioGroupIndicator>
                  </RadioGroupItem>

                  <RadioGroupItem value="orange" theme="orange" id="r4">
                    <RadioGroupIndicator>
                      <Check color={"white"} width={16} strokeWidth={3} />
                    </RadioGroupIndicator>
                  </RadioGroupItem>

                  <RadioGroupItem value="blue" theme="blue" id="r5">
                    <RadioGroupIndicator>
                      <Check color={"white"} width={16} strokeWidth={3} />
                    </RadioGroupIndicator>
                  </RadioGroupItem>

                  <RadioGroupItem value="pink" theme="pink" id="r6">
                    <RadioGroupIndicator>
                      <Check color={"white"} width={16} strokeWidth={3} />
                    </RadioGroupIndicator>
                  </RadioGroupItem>
                </RadioGroupRoot>
              </Fieldset>
              <Fieldset disabled={loading} className="Fieldset">
                <Label className="Label" htmlFor="title">
                  Name <Required>*</Required>
                </Label>
                <Input
                  className="Input"
                  name="title"
                  id="title"
                  placeholder="e.g. Meta Design System"
                  onChange={handleChange}
                  required
                />
              </Fieldset>
              <Fieldset disabled={loading} className="Fieldset">
                <Label className="Label" htmlFor="description">
                  Description
                </Label>
                <Textarea
                  className="Input"
                  name="description"
                  id="description"
                  placeholder=""
                  onChange={handleChange}
                />
              </Fieldset>
              <Fieldset disabled={loading} className="Fieldset">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Label className="Label" htmlFor="figma_file_key">
                    Figma File Key <Required>*</Required>
                  </Label>
                  <FigmaPopoverGuide />
                </div>
                <Input
                  className="Input"
                  name="figma_file_key"
                  id="figma_file_key"
                  placeholder=""
                  required
                  onChange={handleChange}
                />
              </Fieldset>
              <div
                style={{
                  display: "flex",
                  marginTop: 24,
                  justifyContent: "flex-end",
                  gap: 12,
                }}
              >
                <Dialog.Close asChild>
                  <Button apperance={"ghost"}>Cancel</Button>
                </Dialog.Close>

                <Button
                  type="submit"
                  css={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: 44,
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? <Spinner /> : "Create"}
                </Button>
              </div>
            </form>
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

export default CreateNewDesignSystemDialog;

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

const RadioGroupRoot = styled(RadioGroup.Root, {
  display: "flex",
  gap: 8,
  justifyContent: "center",
});

const RadioGroupItem = styled(RadioGroup.Item, {
  all: "unset",
  width: 20,
  height: 20,
  borderRadius: "100%",
  border: "solid 2px $gray1",
  cursor: "pointer",

  "&:hover": {
    boxShadow: `0 0 0px 2px #ccc`,
  },

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

const IconPreview = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "$4",
});
