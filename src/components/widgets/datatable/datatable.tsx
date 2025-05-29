import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { flexRender, Table as ReactTableType } from "@tanstack/react-table";
import { DataTablePagination } from "./pagination";
import { User } from "@/types/user";

interface CommonDataTableProps<TData> {
  table: ReactTableType<TData>;
  columnsLength: number;
  isUseInactiveStyle?: Boolean;
}

const DataTable = <TData,>({
  table,
  columnsLength,
  isUseInactiveStyle,
}: CommonDataTableProps<TData>) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md overflow-hidden border">
        <Table>
          <TableHeader className="custom-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover: custom-primary">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="text-[#fff] font-bold text-left"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    isUseInactiveStyle && !(row.original as User).is_active
                      ? "text-[#999999] h-[50px]"
                      : "h-[50px]"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-left truncate" key={cell.id}>
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
                <TableCell colSpan={columnsLength} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default DataTable;
