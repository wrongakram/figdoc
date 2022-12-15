import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
import { Button, Icon, Portal } from "./components";
import { styled } from "@stitches/react";
import { Bold, Italic, Underline } from "iconoir-react";

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
        const paragraph: ParagraphElement = {
          type: "paragraph",
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
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

const ComponentEditor = ({
  data,
  setSavingStatus,
  readOnly,
  componentDocumentation,
}: any) => {
  const router = useRouter();
  const { system, component: componentId } = router.query;
  const supabase = useSupabaseClient();
  const { mutate } = useSWRConfig();

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
          <HoveringToolbar />

          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter a title…"
            spellCheck
            readOnly={readOnly}
            onDOMBeforeInput={(event: InputEvent) => {
              switch (event.inputType) {
                case "formatBold":
                  event.preventDefault();
                  return toggleFormat(editor, "bold");
                case "formatItalic":
                  event.preventDefault();
                  return toggleFormat(editor, "italic");
                case "formatUnderline":
                  event.preventDefault();
                  return toggleFormat(editor, "underlined");
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

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "title":
      return <h1 {...attributes}>{children}</h1>;
    case "paragraph":
      return <p {...attributes}>{children}</p>;
  }
};

const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: "all",
  });
  return !!match;
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <Menu
        ref={ref}
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <FormatButton format="bold">
          <Bold />
        </FormatButton>

        <FormatButton format="italic">
          <Italic />
        </FormatButton>

        <FormatButton format="underlined">
          <Underline />
        </FormatButton>
      </Menu>
    </Portal>
  );
};

const Menu = styled("div", {
  padding: "8px 7px 6px",
  position: "absolute",
  zIndex: 1,
  top: -10000,
  left: -10000,
  marginTop: -6,
  opacity: 0,
  background: "#222",
  borderRadius: 4,
  transition: "opacity 0.75s",
});

const FormatButton = ({ format, children }) => {
  const editor = useSlate();
  return (
    <button
      reversed
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      {children}
    </button>
  );
};

export default ComponentEditor;
