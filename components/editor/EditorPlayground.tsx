import React from "react";
import { Plate, TEditableProps } from "@udecode/plate";

const editableProps: TEditableProps = {
  placeholder: "Type...",
};

const PlateEditor = () => <Plate editableProps={editableProps} />;

export default PlateEditor;
