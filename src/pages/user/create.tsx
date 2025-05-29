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
import { Eye, EyeOff, Info, Loader2, RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generatePassword } from "@/utils/password";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  userApi,
} from "@/redux/apiServices/user";
import { MESSAGE } from "@/constants/messages";
import { Role, User } from "@/types/user";
import { useGetProjectsQuery } from "@/redux/apiServices/project";
import { useDispatch } from "react-redux";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CopyDialog from "@/components/user/copyDialog";
import AnimateButton from "@/components/ui/customAnimateButton";
import useToast from "@/hooks/useToast";
import { Switch } from "@/components/ui/switch";
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

const MemberCreateForm: React.FC = () => {
  const roles: Role[] = ["manager", "bse", "leader", "subleader", "member"];

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isWorkflowsDialogOpen, setIsWorkflowsDialogOpen] =
    useState<boolean>(false);
  const [createdUser, setCreatedUser] = useState<{
    email: string | null;
    password: string | null;
  }>({ email: null, password: null });

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
    isActive: true,
    workflowsUrl: "",
    supervisorId: "",
    projectId: "",
  });
  const dispatch = useDispatch();
  const { data: users } = useGetUsersQuery();
  const { data: projects } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createUserMutation, { isSuccess, isError, isLoading }] =
    useCreateUserMutation();
  const { showError } = useToast();

  const handleGeneratePassword = () => {
    const generatedPassword = generatePassword();
    setFormData((prevState) => ({ ...prevState, password: generatedPassword }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const isDisabled = (): boolean => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.projectId
    ) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await createUserMutation(formData).unwrap();
      setCreatedUser({ email: user.email, password: formData.password });

      // force to refetch users data for Leader selectbox
      dispatch(userApi.util.invalidateTags(["User"]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isError) {
      showError(MESSAGE.ERROR.UNKNOWN_ERROR);
      return;
    }
    if (!isSuccess) return;
    setIsDialogOpen(true);

    // reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      isActive: true,
      workflowsUrl: "",
      supervisorId: "",
      projectId: "",
    });
  }, [isSuccess, isError]);

  return (
    <>
      <TooltipProvider>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Member</CardTitle>
            <CardDescription>Add a new member to your dev</CardDescription>
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

              <div className="space-y-2">
                <div className="flex flex-row justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        className="h-[15px] custom-outline no-override"
                        variant="ghost"
                        size="icon"
                        onClick={handleGeneratePassword}
                      >
                        <RefreshCcw />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to generate password</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="custom-outline absolute right-0 top-0 px-3 py-2 !hover:bg-transparent !bg-transparent !rounded-full no-override"
                    onClick={handleTogglePassword}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-4.5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
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
                    value={formData.projectId.toString()}
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
                      value={formData.workflowsUrl}
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
              {isLoading ? (
                <Button className="custom-primary" disabled>
                  <Loader2 className="animate-spin" />
                  <Label>Creating...</Label>
                </Button>
              ) : (
                <AnimateButton
                  contentText="Create User"
                  type="submit"
                  disabled={isLoading || isDisabled()}
                />
              )}
            </CardFooter>
          </form>
        </Card>
      </TooltipProvider>

      {/* <AlertDialog */}
      {createdUser && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <CopyDialog
            titleContent="User created successfully 🎉"
            bodyContent="Here is created user's details"
            userDetail={createdUser}
            buttonContent="Copy & Close"
            onClose={() => setIsDialogOpen(false)}
          />
        </AlertDialog>
      )}

      {/* Workflows Dialog */}
      <WorkflowsDialog
        open={isWorkflowsDialogOpen}
        setOpen={setIsWorkflowsDialogOpen}
      />
    </>
  );
};

export default MemberCreateForm;
