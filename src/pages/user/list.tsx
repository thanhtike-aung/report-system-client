import { columns } from "@/components/user/datatable/column";
import { DataTableSkeleton } from "@/components/user/datatable/datatable-skeleton";
import { DataTable } from "@/components/user/datatable/datatable";
import { useGetUsersQuery } from "@/redux/apiServices/user";
import { useEffect } from "react";
import { useGetProjectsQuery } from "@/redux/apiServices/project";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MESSAGE } from "@/constants/messages";
import { setIsUserUpdateSuccess } from "@/redux/slices/user/userSlice";
import useToast from "@/hooks/useToast";

export default function UsersPage() {
  const { data: users, isLoading } = useGetUsersQuery();
  const { data: projects } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const isUserUpdateSuccess = useSelector(
    (state: RootState) => state.userUpdate.isUserUpdateSuccess
  );
  const { showSuccess } = useToast();
  const dispatch = useDispatch();
  const supervisors = Array.from(
    new Set(users && users.map((item) => item.supervisor?.name).filter(Boolean))
  ) as string[];

  useEffect(() => {
    if (!isUserUpdateSuccess) return;
    showSuccess(`Member ${MESSAGE.SUCCESS.UPDATED}`, {
      onClose: () => {
        dispatch(setIsUserUpdateSuccess(false));
      },
    });
  }, [isUserUpdateSuccess]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Members List</h2>

      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        users && (
          <DataTable
            columns={columns}
            data={users}
            leaders={supervisors}
            projects={projects}
          />
        )
      )}
    </div>
  );
}
