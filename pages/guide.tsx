import React, { ReactElement } from "react";
import PlateEditor, {
  EditorPlayground,
} from "../components/editor/EditorPlayground";
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
      <PlateEditor />
    </div>
  );
};

export default Guide;

Guide.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
