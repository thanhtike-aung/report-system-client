import { Input } from "@/components/ui/input";
import { Column } from "@tanstack/react-table";

interface InputFilterProps<TData> {
  column: Column<TData, unknown> | undefined;
  placeholder?: string;
  className?: string;
}

const InputFilter = <TData,>({
  column,
  placeholder = "Filter...",
  className = "",
}: InputFilterProps<TData>) => {
  if (!column) return null;
  const filterValue = (column.getFilterValue() as string) ?? "";

  return (
    <Input
      placeholder={placeholder}
      value={filterValue}
      onChange={(event) => column.setFilterValue(event.target.value)}
      className={className || "h-8 w-[150px] lg:w-[250px]"}
    />
  );
};

export default InputFilter;
