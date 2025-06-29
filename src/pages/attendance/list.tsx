import * as React from "react";
import { format, isSameDay, parseISO } from "date-fns";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import InputFilter from "@/components/widgets/datatable/input-filter";
import MultiSelectFilter from "@/components/widgets/datatable/multiselect-filter";
import ColumnFilter from "@/components/widgets/datatable/column-filter";
import DataTable from "@/components/widgets/datatable/datatable";
import GeneralError from "@/components/error/general";
import { Attendance } from "@/types/attendance";
import { useGetAttendancesQuery } from "@/redux/apiServices/attendance";
import AttendanceListSkeleton from "./listSkeleton";
import DateFilter from "@/components/widgets/date-filter";

const attendanceListColumns: ColumnDef<Attendance>[] = [
  {
    header: "NO.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "reporter.name",
    header: "NAME",
  },
  {
    accessorKey: "type",
    header: "STATUS",
  },
  {
    accessorKey: "workspace",
    header: "WORKSPACE",
  },
  {
    accessorKey: "leave_period",
    header: "LEAVE PERIOD",
  },
  {
    accessorKey: "creator.name",
    header: "REPORTED BY",
  },
  {
    accessorKey: "updated_at",
    header: "REPORTED AT",
  },
];

/**
 * Main Component
 */
const AttendanceList: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [attendancesForDay, setAttendancesForDay] = React.useState<
    Attendance[] | null
  >(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: attendances, isLoading } = useGetAttendancesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  React.useEffect(() => {
    if (!selectedDate || !attendances) return;

    const filtered = attendances
      .filter((a) => isSameDay(parseISO(a.updated_at), selectedDate))
      .map((a) => ({
        ...a,
        updated_at: format(parseISO(a.updated_at), "yyyy/MM/dd HH:mm"),
      }));

    setAttendancesForDay(filtered);
  }, [selectedDate, attendances]);

  // Table instance
  const table = useReactTable({
    data: attendancesForDay || [],
    columns: attendanceListColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  if (isLoading) return <AttendanceListSkeleton />;
  if (!attendances)
    return (
      <GeneralError
        errorCode={500}
        message="Something went wrong. Please try again!"
      />
    );

  return (
    <div className="w-full max-w-6xl mx-auto my-7 space-y-3">
      <h2 className="text-xl font-semibold mb-7">
        Attendances ({attendancesForDay?.length})
      </h2>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <DateFilter onDateChange={handleDateChange} />
          <InputFilter
            column={table.getColumn("reporter_name")}
            placeholder="Filter by name..."
          />
          <MultiSelectFilter
            column={table.getColumn("creator_name")}
            title={table.getColumn("creator_name")?.columnDef.header as string}
            options={getColumnValues(attendances, "creator").map((creator) => ({
              label: creator.name,
              value: creator.name,
            }))}
          />
        </div>
        <ColumnFilter table={table} />
      </div>

      <DataTable table={table} columnsLength={attendanceListColumns.length} />
    </div>
  );
};

export default AttendanceList;
