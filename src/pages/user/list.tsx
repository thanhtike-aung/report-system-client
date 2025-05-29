import { useGetUsersQuery } from "@/redux/apiServices/user";
import React from "react";
import Error500 from "@/components/error/500";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import InputFilter from "@/components/widgets/datatable/input-filter";
import { userColumns } from "@/pages/user/userColumns";
import MultiSelectFilter from "@/components/widgets/datatable/multiselect-filter";
import ColumnFilter from "@/components/widgets/datatable/column-filter";
import DataTable from "@/components/widgets/datatable/datatable";
import UserListSkeleton from "./listSkeleton";

const MemberList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { data: users, isLoading } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const supervisors = Array.from(
    new Set(users && users.map((item) => item.supervisor?.name).filter(Boolean))
  ) as string[];

  const table = useReactTable({
    data: users || [],
    columns: userColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getColumnValues = (items: Array<Record<string, any>>, key: string) => {
    return items
      .map((item) => item[key])
      .filter(
        (value, index, self) =>
          index === self.findIndex((v) => v.id === value.id)
      );
  };

  if (isLoading) return <UserListSkeleton />;
  if (!users) return <Error500 />;

  return (
    <div className="w-full max-w-6xl mx-auto my-7">
      <h2 className="text-xl font-semibold mb-6">Members ({users.length})</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <InputFilter
              column={table.getColumn("name")}
              placeholder="Filter by name..."
            />
            <MultiSelectFilter
              column={table.getColumn("supervisor")}
              title={table.getColumn("supervisor")?.columnDef.header as string}
              options={supervisors.map((supervisor) => ({
                label: supervisor,
                value: supervisor,
              }))}
            />
            <MultiSelectFilter
              column={table.getColumn("project")}
              title={table.getColumn("project")?.columnDef.header as string}
              options={getColumnValues(users, "project").map((project) => ({
                label: project.name,
                value: project.id.toString(),
              }))}
            />
          </div>
          <ColumnFilter table={table} />
        </div>
        {/* NOTE: to use "isUseInactiveStyle",
            model data binded to table must contain "is_active" data column. */}
        <DataTable
          table={table}
          columnsLength={table.getAllColumns().length}
          isUseInactiveStyle={true}
        />
      </div>
    </div>
  );
};

export default MemberList;
