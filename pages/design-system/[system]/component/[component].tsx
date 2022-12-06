import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Component,
} from "react";
import { styled } from "../../../../stitches.config";

// Next
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import useSWR from "swr";
import { useRouter } from "next/router";

// Utils
import _ from "lodash";
import Navbar from "../../../../components/Navbar";

// Components
import * as Tabs from "@radix-ui/react-tabs";

import { Editable, withReact, useSlate, Slate } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import dynamic from "next/dynamic";

// import Loader from "../../../../components/app/Loader";
import Leaf from "../../../../components/editor/Leaf";
import Element from "../../../../components/editor/Element";
import isHotkey from "is-hotkey";
import Editor from "../../../../components/editor/Editor";

const HOTKEYS = {
  "cmd+b": "bold",
  "cmd+i": "italic",
  "cmd+u": "underline",
  "cmd+c": "code",
};

const isMarkActive = (editor, format) => {
  return false;
  // !!Editor.marks(editor) ? Editor.marks(editor)[format] : false;
};

const Button = ({ active, ...rest }) => {
  return (
    <span
      {...rest}
      className={`${active && "font-bold"} cursor-pointer mr-3 p-1`}
    />
  );
};

const ToolbarButton = ({ format, icon, setCurrentMark, toggleMark }) => {
  const editor = useSlate();

  useEffect(() => {
    if (isMarkActive(editor, format)) {
      setCurrentMark(format);
    }
  }, [editor, format]);

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

// This gets called on every request
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // Run queries with RLS on the server
  const { data } = await supabase
    .from("design_system")
    .select("*")
    .filter("id", "eq", ctx.params?.system)
    .select("*, component (*)")
    .eq("component.id", ctx.params?.component)
    .limit(1)
    .single();

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data,
    },
  };
};

export const Page = styled("div", {
  padding: "24px",
  height: "calc(100vh - 88px)",
});

const Container = styled("div", {
  display: "flex",
  width: "100%",
  height: "100%",
  gap: "40px",
});

const ContainerChild = styled("div", {
  flex: 1,
  height: "100%",
});

const Heading1 = styled("h1", {
  fontSize: "$fontSizes$9",
  fontWeight: "700",
});

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ComponentPage = ({ data, designSystem }: any) => {
  const router = useRouter();
  const { component } = router.query;

  const [currentMark, setCurrentMark] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [savedState, setSavedState] = useState("Saving post");

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Page css={{ padding: 0 }}>
      <pre>
        <small> {JSON.stringify(data, null, 2)}</small>
      </pre>
      <Navbar data={data} />
      <Container css={{ padding: "0 24px" }}>
        <ContainerChild>
          <FigmaComponentPreview url={data.component[0].figma_url} />
        </ContainerChild>
        <ContainerChild>
          <Editor component={component} />
          <ComponentFigmaProps designSystem={data} />
        </ContainerChild>
      </Container>
    </Page>
  );
};

export default ComponentPage;

// FIGMA COMPONENT PROPS

const ComponentFigmaProps = ({ designSystem }) => {
  const [variantData, setVariantData] = useState();

  const { data: figmaData, error } = useSWR([
    "https://api.figma.com/v1/files/" + designSystem.figma_file_key,
    {
      method: "GET",
      headers: {
        "X-Figma-Token": process.env.NEXT_PUBLIC_FIGMA_TOKEN,
      },
    },
  ]);

  useEffect(() => {
    if (figmaData) {
      let filterComponentVariant = _.flatten(
        _.toPairs(figmaData.components).map((variant) => {
          return _.filter(variant, {
            componentSetId: designSystem.component[0].nodeId,
          });
        })
      );

      let getProperties = filterComponentVariant.map((component) => {
        let properties = _.split(component.name, ",");
        let removeEquals = properties.map((prop) => {
          return _.split(_.trim(prop), "=");
        });

        let turnToObject = _.fromPairs(removeEquals);

        let keys = _.keys(turnToObject);

        return keys;
      });

      let getValues = filterComponentVariant.map((component) => {
        let properties = _.split(component.name, ",");
        let removeEquals = properties.map((prop) => {
          return _.split(_.trim(prop), "=");
        });

        let turnToObject = _.fromPairs(removeEquals);

        let values = _.values(turnToObject);

        return values;
      });

      let props = _.uniq(_.flatten(getProperties));
      let values = getValues;

      // Create a new object where props is the index and values gets added to its respective index
      let propsAndValues = props.map((prop, index) => {
        return {
          [prop]: _.uniq(
            values.map((value) => {
              return value[index];
            })
          ),
        };
      });

      console.log(propsAndValues, "Properties");

      setVariantData(propsAndValues);
    }
  }, [figmaData, designSystem]);

  if (error) {
    return <p>No data</p>;
  }
  if (!figmaData) return "";

  return (
    <div>
      <PropTable>
        <PropTableHeader>
          <PropTableHeaderCell>Property</PropTableHeaderCell>
          <PropTableHeaderCell>Value</PropTableHeaderCell>
          <PropTableHeaderCell>Type</PropTableHeaderCell>
        </PropTableHeader>
        <PropTableBody>
          {variantData?.map((variant) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <PropTableRow>
                <PropTableCell>{_.keys(variant)}</PropTableCell>
                <PropTableCell>
                  {_.values(variant).map((value) => {
                    let a = _.split(value, ",");
                    return a.map((v, id) => <span key={id}>{v}</span>);
                  })}
                </PropTableCell>
                <PropTableCell>
                  {_.values(variant).map((value) => {
                    let a = _.split(value, ",");
                    return a.map((v, id) => (
                      <>
                        {v === "True" || v === "False" ? (
                          <span className="type" key={id}>
                            Boolean
                          </span>
                        ) : (
                          <span className="type" key={id}>
                            String
                          </span>
                        )}
                      </>
                    ));
                  })}
                </PropTableCell>
              </PropTableRow>
            );
          })}
        </PropTableBody>
      </PropTable>
    </div>
  );
};

const PropTable = styled("div", {
  fontFamily: "SF Mono, Menlo, monospace",
  border: "1px solid $gray5",
  borderRadius: 6,
});

const PropTableHeader = styled("div", {
  height: 40,
  padding: "0px 16px",
  background: "$gray2",
  display: "flex",
  alignItems: "center",
  fontSize: 13,
  color: "$gray11",
  borderRadius: "6px 6px 0 0",
});

const PropTableHeaderCell = styled("div", {
  flex: 1,
});

const PropTableBody = styled("div", {});

const PropTableRow = styled("div", {
  display: "flex",
  padding: "16px 16px",
  borderBottom: "1px solid $gray5",
});

const PropTableCell = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  fontSize: 13,
  color: "$gray12",
  div: {
    display: "flex",
    flexDirection: "column",
    width: 90,
  },

  ".type": {
    display: "none",
    color: "$pink11",
  },

  ".type:first-child": {
    display: "block",
  },
});

const TabsRoot = styled(Tabs.Root, {
  display: "flex",
  flexDirection: "column",
});

const TabsList = styled(Tabs.List, {
  flexShrink: 0,
  display: "flex",
});

const TabsTrigger = styled(Tabs.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  padding: "0 20px",
  height: 48,
  display: "flex",
  alignItems: "center",
  fontSize: 14,
  lineHeight: 1,
  color: "$gray11",
  userSelect: "none",
  cursor: "pointer",
  borderRadius: "6px",
  "&:hover": { background: "$gray3" },
  '&[data-state="active"]': {
    color: "$gray12",
    background: "$gray4",
  },
  "&:focus": { position: "relative", boxShadow: `0 0 0 2px black` },
});

const TabsContent = styled(Tabs.Content, {
  flexGrow: 1,
  padding: 20,
  backgroundColor: "white",
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  outline: "none",
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

// EDITOR COMPONENT

// FIGMA EMBED

const FigmaPreviewFrame = styled("div", {
  height: "100%",
  iframe: { border: "1px solid $gray5", borderRadius: 8 },
});

const FigmaComponentPreview = ({ url }: any) => {
  return (
    <FigmaPreviewFrame>
      <iframe width="100%" height="100%" src={url}></iframe>
    </FigmaPreviewFrame>
  );
};
