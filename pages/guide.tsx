import React, { ReactElement } from "react";
import { EditorPlayground } from "../components/editor/EditorPlayground";
import Layout from "../components/Layout";

import {
  H1,
  H2,
  H3,
  H4,
  P,
  Caption,
  Subtitle,
} from "../components/primitives/Text";
import { useProfileStore } from "../context/ProfileContext";

const Guide = () => {
  return (
    <div style={{ padding: 40 }}>
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <Caption>Caption</Caption>
      <Subtitle>Subtitle</Subtitle>
      <P>This is a paragraph tag</P>
      <P apprance={"secondary"}>This is a paragraph tag with secondary color</P>
      <EditorPlayground />
    </div>
  );
};

export default Guide;

Guide.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
