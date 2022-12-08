import React, { useState, useReducer, useEffect } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

import { styled } from "../stitches.config";

import { MoreHoriz, StarOutline } from "iconoir-react";

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

type Component = {
  name: string;
  nodeId: number;
};

const columnHelper = createColumnHelper<Component>();

export default function MembersTable({
  members,
  rowSelection,
  setRowSelection,
  tableType,
}) {
  const [data, setData] = useState(() => [...members]);

  // Row selection

  const columns = React.useMemo<ColumnDef<Component>[]>(
    () => [
      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler(),
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <div style={{ display: "flex", flex: 2 }}>
      //       <IndeterminateCheckbox
      //         {...{
      //           checked: row.getIsSelected(),
      //           indeterminate: row.getIsSomeSelected(),
      //           onChange: row.getToggleSelectedHandler(),
      //         }}
      //       />
      //     </div>
      //   ),
      // },

      columnHelper.accessor(tableType == "members" ? "email" : "invitee", {
        header: "email",
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("role", {
        header: "role",
        cell: (info) => (
          <span style={{ display: "flex", gap: 5 }}>
            {info.renderValue()}

            {info.renderValue() === "admin" && (
              <Star>
                <StarOutline width={14} />
              </Star>
            )}
          </span>
        ),
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("created_at", {
        header: tableType == "members" ? "Joined at" : "Invited at",
        cell: (info) =>
          moment(info.renderValue()).add(24, "hours").format("LLL"),
        footer: (info) => info.column.id,
      }),

      {
        header: " ",
        cell: ({ row, info }) => (
          <div
            style={{
              display: "flex",
              flex: 2,
              justifyContent: "flex-end",
              paddingRight: 24,
            }}
          >
            {row.original.role === "editor" && (
              <MoreDropdown id={row.original.id} tableType={tableType}>
                <IconButton>
                  <MoreHoriz width={18} />
                </IconButton>
              </MoreDropdown>
            )}
          </div>
        ),
      },
    ],
    []
  );

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

const Star = styled("div", {
  display: "flex",
  alignItems: "center",
  svg: {
    fill: "$yellow10",
    color: "$yellow10",
  },
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
  fontSize: "14px",
  color: "$gray12",
  justifyContent: "flex-start",

  "&:first-child": {
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

// function IndeterminateCheckbox({
//   indeterminate,
//   className = "",
//   ...rest
// }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
//   const ref = React.useRef<HTMLInputElement>(null!);

//   React.useEffect(() => {
//     if (typeof indeterminate === "boolean") {
//       ref.current.indeterminate = !rest.checked && indeterminate;
//     }
//   }, [ref, indeterminate]);

//   return (
//     <>
//       <Checkbox type="checkbox" ref={ref} {...rest} />
//     </>
//   );
// }

const MoreDropdown = ({ children, id, tableType }) => {
  const user = useUser();
  const [admin, setAdmin] = useState();

  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { mutate } = useSWRConfig();

  const DELETE_INVITE = async (db) => {
    try {
      // Delete Design System
      const { error } = await supabaseClient.from(db).delete().eq("id", id);

      // mutate(`http://localhost:3000/api/design-systems/getAllDesignSystems`);
      router.reload();

      if (error)
        throw {
          error,
        };
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent size="md" collisionPadding={{ right: 24 }}>
          <DropdownMenuItem
            onClick={() => DELETE_INVITE(tableType)}
            destructive
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
