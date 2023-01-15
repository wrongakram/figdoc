import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  Svg3DSelectFace,
  Lock,
  MoreHorizCircledOutline,
  MoreHoriz,
  Puzzle,
  Figma,
} from "iconoir-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { styled } from "../stitches.config";

import { DesignSystemData } from "../types";

// Utils
import _ from "lodash";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./DropdownMenu";
import FDSystemIcon from "./FDSystemIcon";
import Image from "next/image";
import Spinner from "./Spinner";
import { useProfileStore } from "../context/ProfileContext";
import { capitalizeFirstLetter } from "../utils/functions/capitalizeFirstLetter";

const ComponentCard = styled(Link, {
  position: "relative",
  overflow: "hidden",

  "&:hover": {
    ".cover": {
      background: "$gray4",
    },
  },

  ".cover": {
    background: "$gray2",
    height: "200px",
    display: "block",
    padding: 32,
    borderRadius: 12,
    transition: "background 160ms ease-out",
    ".img": {
      height: "100%",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },

  ".content": {
    padding: "12px 4px 0px 4px",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 2,
    ".title": {
      fontSize: "$3",
      fontWeight: "600",
      color: "$gray12",
      textTransform: "capitalize",
    },

    ".description": {
      fontSize: "$2",
      color: "$gray11",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": 2,
      overflow: "hidden",
      lineHeight: "1.3rem",
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

const Cover = styled("div", {
  background: "$gray4",
  height: "48px",
  display: "block",

  variants: {
    color: {
      violet: {},
      green: {},
    },
  },

  compoundVariants: [
    {
      color: "violet",
      css: {
        backgroundColor: "$violet4",
      },
    },
    {
      color: "green",
      css: {
        backgroundColor: "$green4",
      },
    },
  ],
});

type DesignSystem = {
  id: string;
  created_at: string;
  title: string;
  created_by: string;
  description: string | null;
  figma_file_key: string;
  theme: string;
};

export const FDComponentCard = ({
  component,
  fileKey,
}: {
  component: any;
  fileKey: any;
}) => {
  const router = useRouter();
  const { system } = router.query;

  return (
    <ComponentCard
      href={{
        pathname: `/design-system/${system}/component/${component?.id}`,
      }}
    >
      <ComponentCoverImage fileKey={fileKey} nodeId={component.nodeId} />

      {!component.nodeId && <FigmaTag>CUSTOM</FigmaTag>}
      <div className="content">
        <div style={{ display: "flex" }}>
          <div className="title">
            {capitalizeFirstLetter(component.title || "Untitled")}
          </div>
        </div>
        <div className="description">{component.description}</div>
      </div>
      <DesignSystemCardDropdown id={component?.id} component={component}>
        <IconButton>
          <MoreHoriz width={18} />
        </IconButton>
      </DesignSystemCardDropdown>
    </ComponentCard>
  );
};

const ComponentCoverImage = ({ fileKey, nodeId }: any) => {
  const { data: figmaToken }: any = useProfileStore();

  // States
  const [allComponentThumbnails, setAllComponentThumbnails] = useState("");

  const { data, error } = useSWR([
    "https://api.figma.com/v1/files/" + fileKey + "/components",
    {
      method: "GET",
      headers: {
        "X-Figma-Token": figmaToken?.figma_token,
      },
    },
  ]);

  useEffect(() => {
    if (data) {
      let matchingComponents = _.filter(data.meta?.components, function (obj) {
        if (obj.containing_frame && !obj.containing_frame.name) {
          obj.containing_frame.name = obj.name;
          obj.containing_frame.nodeId = obj.node_id;
        }

        return obj.containing_frame?.nodeId === nodeId;
      });

      setAllComponentThumbnails(matchingComponents[0]?.thumbnail_url);
    }
  }, [data, nodeId]);

  if (error) {
    return (
      <div className="cover">
        <div className="img">No figma key specified</div>
      </div>
    );
  }
  if (!data)
    return (
      <div className="cover">
        <div className="img">
          <Spinner color="black" />
        </div>
      </div>
    );

  return (
    <div className="cover">
      <div className="img">
        {allComponentThumbnails ? (
          <Image
            // loader={myLoader}
            src={allComponentThumbnails}
            alt="Picture of the author"
            fill
            style={{ objectFit: "contain" }}
            quality={100}
          />
        ) : (
          <>
            <p>No preview</p>
          </>
        )}
      </div>
    </div>
  );
};

const ComponentCardAvatar = styled("div", {
  backgroundColor: "$gray4",
  height: 32,
  width: 32,
  borderRadius: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ComponentVisual = styled("div", {
  backgroundColor: "$gray4",
  height: 60,
  width: 60,
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
});

const IconButton = styled("button", {
  position: "absolute",
  top: 6,
  right: 12,
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 36,
  width: 36,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray12",
  "&:hover": { backgroundColor: "rgba(100,100,100,.06)" },
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

const DesignSystemCardDropdown = ({ children, id, component }: any) => {
  const user = useUser();
  const router = useRouter();
  const { system } = router.query;
  const supabaseClient = useSupabaseClient();
  const { mutate } = useSWRConfig();

  const deleteComponent = async () => {
    try {
      // Delete Design System
      const { error } = await supabaseClient
        .from("component")
        .delete()
        .eq("id", id);

      mutate(`/api/design-systems/${system}`);
      router.push(`/design-system/${system}`);

      if (error)
        throw {
          error,
        };
    } catch (error: any) {
      console.log(error);
    }
  };

  const goToFigmaFile = (e: React.MouseEvent, figmaDetails: string) => {
    e.preventDefault();
    window.open(`https://www.figma.com/file/${figmaDetails}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent size="md" collisionPadding={{ right: 24 }}>
        <DropdownMenuItem
          onClick={(e) =>
            goToFigmaFile(
              e,
              _.trim(
                component.figma_url,
                "https://www.figma.com/embed?embed_host=astra&url="
              )
            )
          }
        >
          Go to Figma
        </DropdownMenuItem>
        <>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuItem onClick={deleteComponent} destructive>
            Delete
          </DropdownMenuItem>
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FigmaTag = styled("div", {
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "rgba(0,0,0,.04)",
  color: "$gray11",
  textTransform: "uppercase",
  letterSpacing: ".04rem",
  padding: "4px 10px",
  fontSize: 10.5,
  fontWeight: 600,
  borderRadius: 100,
});
