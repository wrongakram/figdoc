import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Slate, Editable, withReact } from "slate-react";
import {
  Transforms,
  createEditor,
  Node,
  Element as SlateElement,
  Descendant,
} from "slate";
import { withHistory } from "slate-history";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import _ from "lodash";
import Spinner from "../Spinner";

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

const Editor = ({
  data,
  setSavingStatus,
  readOnly,
  componentDocumentation,
}: any) => {
  const router = useRouter();
  const { system, component: componentId } = router.query;
  const supabaseClient = useSupabaseClient();
  const { mutate } = useSWRConfig();

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const [editor] = useState(() =>
    withHistory(withLayout(withReact(createEditor())))
  );

  const saveContent = async (content, id) => {
    try {
      setSavingStatus("saving");
      const { error } = await supabaseClient
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
          <Editable
            renderElement={renderElement}
            placeholder="Enter a title…"
            spellCheck
            readOnly={readOnly}
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

export default Editor;
