"use client";

import { useState, useMemo, useEffect } from "react";
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
  type SortingState,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { tableDefinition } from "@/schemas/tableDefinition";

const columnHelper = createColumnHelper<tableDefinition>();

const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const searchTerm = filterValue.toLowerCase();

  return Object.values(row.original).some(
    (value) => value && value.toString().toLowerCase().includes(searchTerm)
  );
};

const getStatusColor = (status: string) => {
  status = status.toLowerCase();

  if (status.includes("hired") || status.includes("accepted"))
    return "bg-green-500 text-white";

  if (status.includes("rejected") || status.includes("declined"))
    return "bg-red-500 text-white";

  if (status.includes("interview") || status.includes("reviewing"))
    return "bg-yellow-400 text-black";

  if (status.includes("pending") || status.includes("waiting"))
    return "bg-gray-400 text-white";

  return "bg-[var(--muted)] text-[var(--muted-foreground)]";
};

const ApplicationTable = ({ tableData }) => {
  const [data, setData] = useState(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(
    () => [
      columnHelper.accessor("applicant_name", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer font-bold text-heading"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Applicant Name
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p className="font-medium">{info.getValue()}</p>,
      }),
      columnHelper.accessor("applied_position", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer font-bold text-heading"
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
              className="flex items-center gap-1 cursor-pointer font-bold text-heading"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => (
          <Badge className={`font-medium ${getStatusColor(info.getValue())}`}>
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("tech_stack", {
        header: () => <div className="font-bold text-heading">Tech Stack</div>,
        cell: (info) => (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {info
              .getValue()
              .split(",")
              .map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-[var(--accent)] text-[var(--accent-foreground)]"
                >
                  {tech.trim()}
                </Badge>
              ))}
          </div>
        ),
      }),
      columnHelper.accessor("applicant_email", {
        header: () => <div className="font-bold text-heading">Email</div>,
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applicant_phone_number", {
        header: () => (
          <div className="font-bold text-heading">Phone Number</div>
        ),
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("applicant_experience", {
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-1 cursor-pointer font-bold text-heading"
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
              className="flex items-center gap-1 cursor-pointer font-bold text-heading"
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
              className="flex items-center gap-1 cursor-pointer font-bold text-heading"
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
        header: () => <div className="font-bold text-heading">References</div>,
        cell: (info) => (
          <p className="max-w-[200px] truncate">{info.getValue()}</p>
        ),
      }),
    ],
    []
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
    manualPagination: false, // Let tanstack handle pagination
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      // This is crucial for proper pagination control
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  // Handle pagination manually
  const handlePreviousPage = () => {
    table.previousPage();
  };

  const handleNextPage = () => {
    table.nextPage();
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    table.setPageSize(newPageSize);
  };

  return (
    <div className="space-y-4 bg-[var(--card)] p-6 rounded-[var(--radius-lg)] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
          <Input
            placeholder="Search applicants..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-full sm:w-80 bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--caption)] whitespace-nowrap">
            Rows per page:
          </p>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[80px] bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--popover)] text-[var(--popover-foreground)]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[var(--secondary)] hover:bg-[var(--secondary)]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border border-[var(--border)] py-3 px-4 text-[var(--secondary-foreground)]"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    i % 2 === 0
                      ? "bg-[var(--background)] hover:bg-[var(--muted)]"
                      : "bg-[var(--muted)] hover:bg-[var(--muted)]"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border border-[var(--border)] py-3 px-4 text-[var(--paragraph)]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center border border-[var(--border)] text-[var(--paragraph)]"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
            className="bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
            className="bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="text-sm text-[var(--caption)]">
          Page{" "}
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          of <span className="font-medium">{table.getPageCount() || 1}</span> |
          Showing{" "}
          <span className="font-medium">
            {table.getFilteredRowModel().rows.length > 0
              ? table.getRowModel().rows.length
              : 0}
          </span>{" "}
          of{" "}
          <span className="font-medium">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          results
        </div>
      </div>
    </div>
  );
};

export default ApplicationTable;
