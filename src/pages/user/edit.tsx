import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Loader2 } from "lucide-react";
import {
  useGetUserByIdQuery,
  useGetUsersQuery,
  userApi,
  useUpdateUserMutation,
} from "@/redux/apiServices/user";
import { MESSAGE } from "@/constants/messages";
import { Role, User } from "@/types/user";
import { useGetProjectsQuery } from "@/redux/apiServices/project";
import { useNavigate, useParams } from "react-router-dom";
import SkeletonEditForm from "./editSkeleton";
import { useDispatch } from "react-redux";
import { setIsUserUpdateSuccess } from "@/redux/slices/user/userSlice";
import useToast from "@/hooks/useToast";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WorkflowsDialog from "@/components/user/workflowsInfoDialog";

export const useFormState = (initialState: Record<string, any>) => {
  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: string,
    value: string,
    users?: User[] | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // dynamic values for Leader select box along with selected Role
    if (name === "role" && users) {
      const roleHierarchy: Record<string, string[]> = {
        manager: ["manager"],
        bse: ["manager", "bse"],
        leader: ["manager", "bse", "leader"],
        subleader: ["manager", "bse", "leader", "subleader"],
      };

      setFilteredUsers(
        roleHierarchy[value]
          ? users.filter((user) => roleHierarchy[value].includes(user.role))
          : users
      );
    }
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    filteredUsers,
    setFilteredUsers,
  };
};

const MemberEditForm: React.FC = () => {
  const roles: Role[] = ["manager", "bse", "leader", "subleader", "member"];
  const [isWorkflowsDialogOpen, setIsWorkflowsDialogOpen] =
    useState<boolean>(false);
  const {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    filteredUsers,
  } = useFormState({
    name: "",
    email: "",
    password: "",
    role: "",
    workflowsUrl: "",
    isActive: true,
    supervisorId: "",
    projectId: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: users } = useGetUsersQuery();
  const {
    data: targetUser,
    isLoading: isTargetUserLoading,
    isSuccess: isTargetUserSuccess,
    refetch,
  } = useGetUserByIdQuery(id || "");
  const { data: projects } = useGetProjectsQuery();
  const [updateUserMutation, { isSuccess, isLoading, isError }] =
    useUpdateUserMutation();
  const { showError } = useToast();

  const isDisabled = (): boolean => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      !formData.projectId ||
      ((formData.role === "bse" || formData.role === "leader") &&
        !formData.workflowsUrl)
    ) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      await updateUserMutation({
        id: id,
        body: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          workflowsUrl: formData.workflowsUrl,
          isActive: formData.isActive,
          supervisorId: formData.supervisorId,
          projectId: formData.projectId,
        },
      });

      // force refetch to get updated users' data
      dispatch(userApi.util.invalidateTags(["User"]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    refetch();
  }, [id, refetch]);

  useEffect(() => {
    if (!targetUser || !isTargetUserSuccess) return;
    setFormData({
      name: targetUser?.name,
      email: targetUser.email,
      role: targetUser.role,
      workflowsUrl: targetUser.workflows_url,
      isActive: targetUser.is_active,
      supervisorId: targetUser.supervisor_id?.toString(),
      projectId: targetUser.project_id.toString(),
    });
  }, [targetUser, isTargetUserLoading]);

  useEffect(() => {
    if (isError) {
      showError(MESSAGE.ERROR.UNKNOWN_ERROR);
      return;
    }
  }, [isError]);

  useEffect(() => {
    if (!isSuccess) return;
    dispatch(setIsUserUpdateSuccess(true));
    navigate("/members");
  }, [isSuccess]);

  return (
    <>
      {isTargetUserLoading ? (
        <SkeletonEditForm />
      ) : (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Member</CardTitle>
            <CardDescription>Edit member's data</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    key={formData.role}
                    value={formData.role}
                    onValueChange={(value) =>
                      handleSelectChange("role", value, users)
                    }
                  >
                    <SelectTrigger
                      id="role"
                      className="w-full !border-[#dadee3]"
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor">Leader</Label>
                  <Select
                    key={formData.supervisorId}
                    value={formData.supervisorId}
                    onValueChange={(value) =>
                      handleSelectChange("supervisorId", value)
                    }
                  >
                    <SelectTrigger
                      id="supervisor"
                      className="w-full !border-[#dadee3]"
                    >
                      <SelectValue placeholder="Select leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {(filteredUsers || users || []).map((supervisor) => (
                        <SelectItem
                          key={supervisor.id}
                          value={supervisor.id.toString()}
                        >
                          {supervisor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    key={formData.projectId}
                    value={formData.projectId}
                    onValueChange={(value) =>
                      handleSelectChange("projectId", value)
                    }
                  >
                    <SelectTrigger
                      id="project"
                      className="w-full !border-[#dadee3]"
                    >
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects &&
                        projects.map((project) => (
                          <SelectItem
                            key={project.id}
                            value={project.id.toString()}
                          >
                            {project.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.role === "manager" ||
                formData.role === "bse" ||
                formData.role === "leader" ||
                formData.role === "subleader") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor="workflowsUrl">
                      Workflows URL
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            className="h-4 w-4 hover:cursor-pointer"
                            onClick={() => setIsWorkflowsDialogOpen(true)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How to create workflows?</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="workflowsUrl"
                      name="workflowsUrl"
                      value={formData.workflowsUrl || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(value) =>
                      handleSwitchChange("isActive", value)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end mt-3">
              <Button
                type="submit"
                className="custom-primary"
                disabled={isLoading || isDisabled()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />{" "}
                    <Label>Updating...</Label>
                  </>
                ) : (
                  <Label>Update Member</Label>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Workflows Dialog */}
      <WorkflowsDialog
        open={isWorkflowsDialogOpen}
        setOpen={setIsWorkflowsDialogOpen}
      />
    </>
  );
};

export default MemberEditForm;
