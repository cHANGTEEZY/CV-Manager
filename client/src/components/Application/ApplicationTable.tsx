import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { tableDefinition } from "@/schemas/tableDefinition";

const columnHelper = createColumnHelper<tableDefinition>();

const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const searchTerm = filterValue.toLowerCase();

  return Object.values(row.original).some(
    (value) => value && value.toString().toLowerCase().includes(searchTerm),
  );
};

const ApplicationTable = ({ tableData }) => {
  const [data, setData] = useState(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("applicant_name", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Applicant Name
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applied_position", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Applied Position
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applicant_status", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("tech_stack", {
        header: "Tech Stack",
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applicant_email", {
        header: "Email",
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applicant_phone_number", {
        header: "Phone Number",
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applicant_experience", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Experience
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applicant_experience_level", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Experience Level
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("expected_salary", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Expected Salary
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("references", {
        header: "References",
        cell: (info) => <p>{info.getValue()}</p>,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="text-gray-400" />
        <Input
          placeholder="Search across all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table className="border-2">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="select-none border-r-2 border-b-2"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border-r">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sticky left-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTable;
