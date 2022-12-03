import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import {
  Transforms,
  createEditor,
  Node,
  Element as SlateElement,
  Descendant,
} from "slate";
import { withHistory } from "slate-history";
import { ParagraphElement, TitleElement } from "./custom-types";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

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

const Editor = ({ component }) => {
  const router = useRouter();
  const { system } = router.query;

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const { data, error } = useSWR(
    `http://localhost:3000/api/design-systems/${system}/component/${component}`,
    {
      revalidateOnMount: true,
    }
  );

  const editor = useMemo(() => withLayout(withReact(createEditor())), []);

  const initialValue = useMemo(
    () =>
      data?.documentation || [
        {
          type: "title",
          children: [{ text: "" }],
        },
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
    [data, component]
  );

  if (error) {
    return <p>oops something went wrong</p>;
  }
  if (!data) return <p>loading...</p>;

  return (
    <>
      {data && (
        <Slate
          editor={editor}
          value={data?.documentation}
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => "set_selection" !== op.type
            );
            if (isAstChange) {
              // Save the value to Local Storage.
              const content = JSON.stringify(value);

              // localStorage.setItem("content", content);
            }
          }}
        >
          <Editable
            renderElement={renderElement}
            placeholder="Enter a title…"
            spellCheck
            autoFocus
          />
        </Slate>
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
