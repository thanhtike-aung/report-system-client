import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  projectApi,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "@/redux/apiServices/project";
import ListSkeleton from "./listSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { decodeJWT } from "@/utils/jwt";
import { DeleteWarningDialog } from "@/components/project/deleteWarningDialog";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationButton } from "@/components/customButton";
import { timeAgo } from "@/utils/datetime";
import { Project } from "@/types/project";
import { MESSAGE } from "@/constants/messages";
import { Input } from "@/components/ui/input";
import { USER_ROLES } from "@/constants";
import useToast from "@/hooks/useToast";

interface ProjectEditFormProps {
  project: Project;
  onCancelEdit: () => void;
}

const ProjectCard: React.FC<{
  project: Project;
  confirmDelete: boolean;
  onDelete: (project: Project) => void;
  onCancel: (projectId: string) => void;
  onShowConfirmation: (projectId: string, show: boolean) => void;
}> = ({ project, confirmDelete, onDelete, onCancel, onShowConfirmation }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const currentUser = decodeJWT(
    useSelector((state: RootState) => state.auth.authToken)
  );

  return (
    <Card key={project.id} className="relative pt-0 rounded-md">
      <div
        className={`h-1 rounded-t-md`}
        style={{ background: project.color }}
      ></div>
      <CardHeader>
        <CardTitle>
          <div className={`bg-[${project.color}]`}></div>
          {isEdit ? (
            <ProjectEditForm
              project={project}
              onCancelEdit={() => setIsEdit(false)}
            />
          ) : (
            <Label className="h-9">{project.name}</Label>
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Last updated:{" "}
          {timeAgo(project.updated_at || "2025-05-07 16:49:52.888")}
        </span>
        {currentUser.role !== USER_ROLES.MEMBER && (
          <div className="flex w-[70px] justify-between space-x-2">
            {!confirmDelete && (
              <Button
                size="icon"
                className="custom-primary custom-animate-button"
                onClick={() => setIsEdit(true)}
              >
                <Settings />
              </Button>
            )}
            <DeleteConfirmationButton
              onDelete={() => onDelete(project)}
              onCancel={() => onCancel(project.id.toString())}
              onShowConfirmation={(show) =>
                onShowConfirmation(project.id.toString(), show)
              }
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const ProjectList: React.FC = () => {
  const [openWarning, setOpenWarning] = useState<boolean>(false);
  const [confirmDeleteMap, setConfirmDeleteMap] = useState<
    Record<string, boolean>
  >({});
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const { data: projects, isLoading } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [projectDeleteMutation, { isSuccess: isProjectDeleteSuccess }] =
    useDeleteProjectMutation();
  const { showSuccess } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async (project: Project) => {
    // project have active members
    if (project.users && project.users.length !== 0) {
      setTargetProject(project);
      setOpenWarning(true);
      return;
    }
    try {
      await projectDeleteMutation(project.id);
    } catch (error) {
      console.error(error);
    }
    setConfirmDeleteMap((prev) => ({ ...prev, [project.id]: false }));
  };

  const handleShowConfirmation = (projectId: string, show: boolean) => {
    setConfirmDeleteMap((prev) => ({ ...prev, [projectId]: show }));
  };

  const handleCancel = (projectId: string) => {
    setConfirmDeleteMap((prev) => ({ ...prev, [projectId]: false }));
  };

  useEffect(() => {
    if (!isProjectDeleteSuccess) return;
    showSuccess(`Project ${MESSAGE.SUCCESS.DELETED}`);
    dispatch(projectApi.util.invalidateTags(["Projects"]));
  }, [isProjectDeleteSuccess]);

  if (isLoading) {
    return <ListSkeleton />;
  }

  return (
    <Card className="max-w-5xl w-full mx-auto">
      <CardHeader className="font-semibold text-xl">
        Projects ({projects?.length})
      </CardHeader>
      <CardContent>
        {projects ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-9">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                confirmDelete={!!confirmDeleteMap[project.id]}
                onDelete={handleDelete}
                onCancel={handleCancel}
                onShowConfirmation={handleShowConfirmation}
              />
            ))}

            {/* Alert Dialog */}
            <DeleteWarningDialog
              open={openWarning}
              setOpen={setOpenWarning}
              project={targetProject}
            />
          </div>
        ) : (
          <Label className="text-red-500">Something went wrong!</Label>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectEditForm: React.FC<ProjectEditFormProps> = ({
  project,
  onCancelEdit,
}) => {
  const [projectName, setProjectName] = useState<string>(project.name);

  const [projectUpdateMutation, { isSuccess: isProjectUpdateSuccess }] =
    useUpdateProjectMutation();
  const { showSuccess } = useToast();
  const dispatch = useDispatch();
  const ref = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    onCancelEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!projectName) return;
      await projectUpdateMutation({
        id: project.id,
        body: { name: projectName },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isProjectUpdateSuccess) return;
    showSuccess(`Project ${MESSAGE.SUCCESS.UPDATED}`);
    ref.current?.blur();
    dispatch(projectApi.util.invalidateTags(["Projects"]));
  }, [isProjectUpdateSuccess]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <>
      <form
        className="flex justify-between space-x-1.5"
        onSubmit={handleSubmit}
      >
        <Input
          ref={ref}
          name="name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onBlur={handleCancel}
        />
      </form>
    </>
  );
};

export default ProjectList;
