/* eslint-disable react/display-name */
import React, { Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";

interface BaseProps {
  className: string;
  style: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => <span {...props} ref={ref} style={{ color: active ? "red" : "black" }} />
);

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any;
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>
  ) => {
    const textLines = value.document.nodes
      .map((node) => node.text)
      .toArray()
      .join("\n");
    return (
      <div ref={ref} {...props}>
        <div>Slate&apos;s value as text</div>
        <div>{textLines}</div>
      </div>
    );
  }
);

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => <span {...props} ref={ref} />
);

export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => <div {...props} ref={ref} />
);

export const Menu = React.forwardRef(
  (
    { style, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => <div {...props} ref={ref} style={style} />
);

export const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => <Menu {...props} ref={ref} />
);
