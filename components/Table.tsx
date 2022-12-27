import React, { useState, useReducer } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

import { styled } from "../stitches.config";

type Component = {
  name: string;
  nodeId: number;
};

const columnHelper = createColumnHelper<Component>();

export default function ImportTable({
  parentComponents,
  numberOfVariants,
  rowSelection,
  setRowSelection,
}) {
  const [data, setData] = useState(() => [...parentComponents]);

  // Row selection

  const columns = React.useMemo<ColumnDef<Component>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div style={{ display: "flex", flex: 2 }}>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },

      columnHelper.accessor("name", {
        header: "Component name",
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("nodeId", {
        header: "Number of Variants",
        cell: (info) => <span>{numberOfVariants(info.getValue())}</span>,
        footer: (info) => info.column.id,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <FDTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFoot>
          <TableRow>
            <th>
              <SelectedRows>
                {Object.keys(rowSelection).length} of{" "}
                {table.getPreFilteredRowModel().rows.length} Total Rows Selected
              </SelectedRows>
            </th>
          </TableRow>
        </TableFoot>
      </FDTable>
    </>
  );
}

const FDTable = styled("table", {
  borderSpacing: 0,
  width: "100%",
  padding: 0,
  borderRadius: 8,
});

const TableHeader = styled("thead", {
  tr: {
    backgroundColor: "$gray3",
    padding: "0 12px",
    borderRadius: 8,
  },

  input: {
    "&::before": {
      top: "1px",
      borderWidth: "0 2.5px 0px 0",
      borderRadius: 0,
      transform: "rotate(90deg)",
    },
  },
});

const Th = styled("th", {
  height: 40,
  display: "inline-flex",
  alignItems: "center",
  minWidth: 200,
  flex: 1,
  padding: 0,

  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: ".8px",
  color: "$gray11",

  "&:first-child": {
    minWidth: 40,
    flex: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

const Td = styled("td", {
  height: 40,
  display: "inline-flex",
  alignItems: "center",
  flex: 1,
  minWidth: 200,
  padding: "0 12px",
  fontSize: "14px",
  color: "$gray12",

  "&:first-child": {
    minWidth: 40,
    flex: 0,
    display: "flex",
    justifyContent: "center",
  },
});

const TableBody = styled("tbody", {
  backgroundColor: "",
});

const TableFoot = styled("tfoot", {
  tr: {
    padding: "0 12px",
  },
});

const TableRow = styled("tr", {
  display: "flex",
  justifyContent: "space-between",
});

const Checkbox = styled("input", {
  margin: 0,
  position: "relative",
  width: 18,
  height: 18,
  color: "#363839",
  border: "1px solid #bdc1c6",
  borderRadius: "4px",
  webkitAppearance: "none",
  mozAppearance: "none",
  appearance: "none",
  outline: "0",
  cursor: "pointer",
  transition: "background 175ms cubic-bezier(0.1, 0.1, 0.25, 1)",

  "&::before": {
    position: "absolute",
    content: "",
    display: "block",
    top: "1.5px",
    left: "5px",
    width: "6px",
    height: "10px",
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: "0 2.5px 2.5px 0",
    borderRadius: 1,
    transform: "rotate(45deg)",
    opacity: 0,
  },

  "&:checked": {
    color: "white",
    borderColor: "$blue9",
    background: "$blue9",

    "&::before": {
      opacity: 1,
    },
  },
});

const SelectedRows = styled("span", {
  fontSize: 14,
  fontWeight: 400,
  color: "$gray11",
});

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <>
      <Checkbox type="checkbox" ref={ref} {...rest} />
    </>
  );
}
