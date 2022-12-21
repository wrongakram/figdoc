import React, { useState, useReducer, useEffect } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

import { styled } from "../stitches.config";

import { MoreHoriz, PasteClipboard, StarOutline } from "iconoir-react";
import { useCopyToClipboard } from "usehooks-ts";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./DropdownMenu";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useSWRConfig } from "swr";

import moment from "moment";
import Image from "next/image";

type Component = {
  name: string;
  nodeId: number;
};

const columnHelper = createColumnHelper<Component>();

const IconButton = styled("button", {
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 32,
  width: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray12",
  "&:hover": { backgroundColor: "rgba(100,100,100,.06)" },
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

export default function StylesTable({ styles, preview }) {
  const [data, setData] = useState(() => [...styles]);
  const [value, copy] = useCopyToClipboard();

  // Row selection

  const columns = React.useMemo<ColumnDef<Component>[]>(
    () => [
      columnHelper.accessor("thumbnail_url", {
        header: " ",
        cell: (info) => (
          <div style={{ width: 40, height: 40, position: "relative" }}>
            <Image
              src={info.renderValue()}
              alt="Figma Token"
              fill
              quality={100}
              layout="fill"
              objectFit="contain"
              style={{ borderRadius: 4, padding: preview === "small" && 10 }}
            />
          </div>
        ),
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("name", {
        header: "name",
        cell: (info) => (
          <span onClick={() => copy(info.renderValue())}>
            {info.renderValue()}
          </span>
        ),
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("description", {
        header: "description",
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
      }),
    ],

    []
  );

  const table = useReactTable({
    data,
    columns,
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
    padding: "0 24px",
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
    flex: 0,
    minWidth: 80,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

const Td = styled("td", {
  height: 72,
  display: "inline-flex",
  alignItems: "center",
  flex: 1,
  minWidth: 200,
  fontSize: "14px",
  color: "$gray12",
  justifyContent: "flex-start",

  "&:first-child": {
    minWidth: 80,
    flex: 0,
    display: "flex",
  },
});

const TableBody = styled("tbody", {
  backgroundColor: "",
  tr: {
    padding: "0 24px",
  },
});

const TableFoot = styled("tfoot", {
  tr: {
    padding: "0 24px",
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
