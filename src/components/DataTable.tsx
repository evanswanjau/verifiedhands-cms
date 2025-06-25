import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
};

const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
}: DataTableProps<T>) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.accessor)}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: skeletonRows }).map((_, idx) => (
              <TableRow key={idx}>
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-6 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((row, idx) => (
              <TableRow key={(row.id as React.Key) ?? idx}>
                {columns.map((col) => (
                  <TableCell key={String(col.accessor)}>
                    {col.render
                      ? col.render(row)
                      : String(row[col.accessor] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
