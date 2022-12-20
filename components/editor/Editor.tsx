import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as Toolbar from "@radix-ui/react-toolbar";
import { violet, blackA, mauve } from "@radix-ui/colors";

// Slate

import { Slate, Editable, withReact, useSlate, useFocused } from "slate-react";
import {
  Transforms,
  createEditor,
  Node,
  Element as SlateElement,
  Text,
  Descendant,
  Range,
  Editor,
} from "slate";
import { withHistory } from "slate-history";

// Next
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

// Supabase
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Lodash
import _ from "lodash";

// HotKeys
import isHotkey from "is-hotkey";

// Components
import Spinner from "../Spinner";
import { styled } from "@stitches/react";
import {
  AlignCenter,
  AlignJustify,
  AlignRight,
  Bold,
  CenterAlign,
  Code,
  Italic,
  List,
  NumberedListLeft,
  TerminalOutline,
  Underline,
} from "iconoir-react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { contentStyles, DropdownMenuItem } from "../DropdownMenu";
import { H4 } from "../primitives/Text";
import { Flex } from "../primitives/structure";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const withLayout = (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const title: TitleElement = {
          type: "title",
          children: [{ text: "Untitled" }],
        };
        Transforms.insertNodes(editor, title, { at: path.concat(0) });
      }

      if (editor.children.length < 2) {
        const description: DescriptionElement = {
          type: "description",
          children: [{ text: "Enter description here..." }],
        };
        Transforms.insertNodes(editor, description, { at: path.concat(1) });
      }

      if (editor.children.length < 3) {
        const paragraph: ParagraphElement = {
          type: "paragraph",
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, paragraph, { at: path.concat(2) });
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        let type: string;
        const slateIndex = childPath[0];
        const enforceType = (type) => {
          if (SlateElement.isElement(child) && child.type !== type) {
            const newProperties: Partial<SlateElement> = { type };
            Transforms.setNodes<SlateElement>(editor, newProperties, {
              at: childPath,
            });
          }
        };

        switch (slateIndex) {
          case 0:
            type = "title";
            enforceType(type);
            break;
          case 1:
            type = "description";
            enforceType(type);
            break;
          case 2:
            type = "paragraph";
            enforceType(type);
          default:
            break;
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

const ComponentEditor = ({ data, readOnly, componentDocumentation }: any) => {
  const router = useRouter();
  const { system, component: componentId } = router.query;
  const supabase = useSupabaseClient();
  const { mutate } = useSWRConfig();

  const [savingStatus, setSavingStatus] = useState("idle");

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const editor = useMemo(
    () => withHistory(withLayout(withReact(createEditor()))),
    []
  );

  // const [editor] = useState(() =>
  //   withHistory(withLayout(withReact(createEditor())))
  // );

  const saveContent = async (content, id) => {
    try {
      setSavingStatus("saving");
      const { error } = await supabase
        .from("component")
        .update([
          {
            title: content[0].children[0].text,
            documentation: content,
          },
        ])
        .eq("id", id);

      setSavingStatus("saved");
      mutate(
        `http://localhost:3000/api/design-systems/${system}/component/${componentId}`
      );

      setTimeout(() => {
        setSavingStatus("idle");
      }, 2000);

      if (error) {
        throw error;
        setSavingStatus("error");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  };

  const changeHandler = (value, id) => {
    saveContent(value, id);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    []
  );

  return (
    <>
      {componentDocumentation ? (
        <Slate
          editor={editor}
          value={componentDocumentation}
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => "set_selection" !== op.type
            );
            if (isAstChange) {
              debouncedChangeHandler(value, data.component[0].id);
            }
          }}
        >
          {!readOnly && (
            <ToolbarRoot aria-label="Formatting options">
              <Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
                <BlockButton format="heading-one">
                  <TextIcon>H1</TextIcon>
                </BlockButton>
                <BlockButton format="heading-two">
                  <TextIcon>H2</TextIcon>
                </BlockButton>
              </Toolbar.ToggleGroup>
              <ToolbarSeparator />
              <Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
                <MarkButton format="bold">
                  <Bold />
                </MarkButton>
                <MarkButton format="italic">
                  <Italic />
                </MarkButton>
                <MarkButton format="underline">
                  <Underline />
                </MarkButton>
                <MarkButton format="code">
                  <Code />
                </MarkButton>
              </Toolbar.ToggleGroup>
              <ToolbarSeparator />
              <Toolbar.ToggleGroup type="single" aria-label="Text formatting">
                <BlockButton format="numbered-list">
                  <NumberedListLeft />
                </BlockButton>
                <BlockButton format="bulleted-list">
                  <List />
                </BlockButton>
              </Toolbar.ToggleGroup>
              <Flex
                alignItemsCenter
                css={{ marginLeft: "auto", marginRight: 8 }}
              >
                {savingStatus === "idle" ? null : savingStatus === "saving" ? (
                  <SaveMessage>Saving...</SaveMessage>
                ) : savingStatus === "saved" ? (
                  <SaveMessage>Saved!</SaveMessage>
                ) : savingStatus === "error" ? (
                  <SaveMessage>Error... couldn&apos;t save</SaveMessage>
                ) : null}
              </Flex>
            </ToolbarRoot>
          )}

          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter a title…"
            spellCheck
            readOnly={readOnly}
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </Slate>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spinner color="black" />
        </div>
      )}
    </>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "title":
      return (
        <h1 style={{ fontSize: "40px" }} {...attributes}>
          {children}
        </h1>
      );
    case "description":
      return (
        <H4
          css={{ fontWeight: 400, color: "$gray10", marginTop: 8 }}
          {...attributes}
        >
          {children}
        </H4>
      );
    case "paragraph":
      return <div {...attributes}>{children}</div>;
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <CodeBlock>{children} </CodeBlock>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, children }) => {
  const editor = useSlate();
  return (
    <ToolbarToggleItem
      value="bold"
      aria-label="Bold"
      data-state={
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )
          ? "on"
          : "off"
      }
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </ToolbarToggleItem>
  );
};

const MarkButton = ({ format, children }) => {
  const editor = useSlate();
  return (
    <ToolbarToggleItem
      active={isMarkActive(editor, format)}
      data-state={isMarkActive(editor, format) ? "on" : "off"}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </ToolbarToggleItem>
  );
};

const Menu = styled("div", {
  position: "absolute",
  zIndex: 1,
  top: -10000,
  left: -10000,
  marginTop: -6,
  opacity: 0,
});

const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);

export default ComponentEditor;

const ToolbarRoot = styled(Toolbar.Root, {
  display: "flex",
  padding: 6,
  width: "100%",
  minWidth: "max-content",
  borderRadius: 6,
  backgroundColor: "white",
  boxShadow: `0 2px 10px #eee`,
  border: "1px solid $gray4",
});

const itemStyles = {
  all: "unset",
  flex: "0 0 auto",
  color: "$gray11",
  height: 28,
  width: 28,
  borderRadius: 8,
  display: "inline-flex",
  fontSize: 12,
  lineHeight: 1,
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { backgroundColor: violet.violet3, color: violet.violet11 },
  "&:focus": { position: "relative", boxShadow: `0 0 0 2px ${violet.violet7}` },
};

const ToolbarToggleItem = styled(Toolbar.ToggleItem, {
  ...itemStyles,
  backgroundColor: "white",
  marginLeft: 2,
  "&:first-child": { marginLeft: 0 },
  "&[data-state=on]": {
    backgroundColor: violet.violet5,
    color: violet.violet11,
  },

  variants: {
    active: {
      true: {
        backgroundColor: violet.violet5,
        color: violet.violet11,
      },
    },
  },
});

const ToolbarSeparator = styled(Toolbar.Separator, {
  width: 1,
  backgroundColor: "$gray6",
  margin: "4px 8px",
});

const ToolbarLink = styled(
  Toolbar.Link,
  {
    ...itemStyles,
    backgroundColor: "transparent",
    color: "$gray11",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  { "&:hover": { backgroundColor: "transparent", cursor: "pointer" } }
);

const ToolbarButton = styled(
  Toolbar.Button,
  {
    ...itemStyles,
    paddingLeft: 10,
    paddingRight: 10,
    color: "white",
    backgroundColor: violet.violet9,
  },
  { "&:hover": { backgroundColor: violet.violet10 } }
);

const TextIcon = styled("span", {
  fontSize: 16,
  lineHeight: 1,
});

const CodeBlock = styled("code", {
  background: "$gray3",
  padding: "4px 0 4px 8px",
  borderRadius: 4,
  fontFamily: "SF mono, monospace",
  fontSize: "$2",
  color: "$red11",
  minWidth: "max-content",
});

const SaveMessage = styled("span", {
  fontSize: 14,
  color: "$gray9",
});
