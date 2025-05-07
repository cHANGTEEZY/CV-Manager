'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@tanstack/react-table';
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { tableDefinition } from '@/schemas/tableDefinition';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<tableDefinition>();

const globalFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {
  // If no search term, show all rows
  if (!value) return true;

  const searchTerm = String(value).toLowerCase();

  // Search through all values in the row
  return Object.values(row.original).some((cellValue) => {
    // Handle null or undefined values
    if (cellValue === null || cellValue === undefined) {
      return false;
    }

    // Convert value to string and search
    return String(cellValue).toLowerCase().includes(searchTerm);
  });
};

const getStatusColor = (status: string) => {
  status = status.toLowerCase();

  if (
    status.includes('hired') ||
    status.includes('accepted') ||
    status.includes('passed')
  )
    return 'bg-green-500 text-white';

  if (
    status.includes('rejected') ||
    status.includes('declined') ||
    status.includes('failed')
  )
    return 'bg-red-500 text-white';

  if (status.includes('interview') || status.includes('reviewing'))
    return 'bg-yellow-400 text-black';

  if (status.includes('eligible for offer'))
    return 'bg-lime-200 text-slate-400';

  if (status.includes('pending') || status.includes('waiting'))
    return 'bg-gray-400 text-white';

  return 'bg-slate-500';
};

const ApplicationTable = ({ tableData }: { tableData: tableDefinition[] }) => {
  const [data] = useState(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(
    () => [
      columnHelper.accessor('applicant_name', {
        header: ({ column }) => {
          return (
            <div
              className="text-heading flex cursor-pointer items-center gap-1 font-bold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Applicant Name
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p className="font-medium">{info.getValue()}</p>,
      }),
      columnHelper.accessor('applied_position', {
        header: ({ column }) => {
          return (
            <div
              className="text-heading flex cursor-pointer items-center gap-1 font-bold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Applied Position
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor('applicant_status', {
        header: ({ column }) => {
          return (
            <div
              className="text-heading flex cursor-pointer items-center gap-1 font-bold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
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
      columnHelper.accessor('tech_stack', {
        header: () => <div className="text-heading font-bold">Tech Stack</div>,
        cell: (info) => (
          <div className="flex max-w-[200px] flex-wrap gap-1">
            {info
              .getValue()
              .split(',')
              .map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-[var(--accent)] text-xs text-[var(--accent-foreground)]"
                >
                  {tech.trim()}
                </Badge>
              ))}
          </div>
        ),
      }),
      columnHelper.accessor('applicant_email', {
        header: () => <div className="text-heading font-bold">Email</div>,
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor('applicant_phone_number', {
        header: () => (
          <div className="text-heading font-bold">Phone Number</div>
        ),
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor('applicant_experience', {
        header: ({ column }) => {
          return (
            <div
              className="text-heading flex cursor-pointer items-center gap-1 font-bold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Experience
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor('applicant_experience_level', {
        header: ({ column }) => {
          return (
            <div
              className="text-heading flex cursor-pointer items-center gap-1 font-bold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Experience Level
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor('expected_salary', {
        header: ({ column }) => {
          return (
            <div
              className="text-heading flex cursor-pointer items-center gap-1 font-bold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Expected Salary
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          );
        },
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor('references', {
        header: () => <div className="text-heading font-bold">References</div>,
        cell: (info) => (
          <p className="max-w-[200px] truncate">{info.getValue()}</p>
        ),
      }),
    ],
    []
  );

  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      fuzzy: globalFilterFn,
    },
    globalFilterFn: globalFilterFn,
    manualPagination: false,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater;

      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  const handlePreviousPage = () => {
    table.previousPage();
  };

  const handleNextPage = () => {
    table.nextPage();
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    table.setPageSize(newPageSize);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-medium">Applicants Table</h2>
        </CardTitle>
        <CardDescription className="mb-4">
          All Candidates Details. Filter and Sort them
        </CardDescription>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
            <Input
              placeholder="Search applicants..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full border-[var(--border)] bg-[var(--background)] pl-10 text-[var(--foreground)] sm:w-80"
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm whitespace-nowrap text-[var(--caption)]">
              Rows per page:
            </p>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[80px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
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
      </CardHeader>
      <CardContent>
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
                      className="border border-[var(--border)] px-4 py-3 text-[var(--secondary-foreground)]"
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
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => {
                      navigate(
                        `/dashboard/application-review/${row.original.id}`
                      );
                    }}
                    className={`${i % 2 === 0 ? 'bg-[var(--background)] hover:bg-[var(--muted)]' : 'bg-[var(--muted)] hover:bg-[var(--muted)]'} cursor-pointer`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border border-[var(--border)] px-4 py-3 text-[var(--paragraph)]"
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
                    className="h-24 border border-[var(--border)] text-center text-[var(--paragraph)]"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!table.getCanPreviousPage()}
              className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!table.getCanNextPage()}
              className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-[var(--caption)]">
            Page{' '}
            <span className="font-medium">
              {table.getState().pagination.pageIndex + 1}
            </span>{' '}
            of <span className="font-medium">{table.getPageCount() || 1}</span>{' '}
            | Showing{' '}
            <span className="font-medium">
              {table.getFilteredRowModel().rows.length > 0
                ? table.getRowModel().rows.length
                : 0}
            </span>{' '}
            of{' '}
            <span className="font-medium">
              {table.getFilteredRowModel().rows.length}
            </span>{' '}
            results
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
