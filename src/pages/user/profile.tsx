"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateProjectMutation,
  useGetProjectsQuery,
} from "@/redux/apiServices/project";
import { decodeJWT } from "@/utils/jwt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import AnimateButton from "@/components/ui/customAnimateButton";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/redux/apiServices/user";
import ProfileSkeleton from "./profileSkeleton";
import GeneralError from "@/components/error/general";
import { MESSAGE } from "@/constants/messages";
import useToast from "@/hooks/useToast";
import { logout } from "@/redux/slices/auth";
import { PRIMARY_COLOR } from "@/constants";

// Custom hook for managing form state
const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return { formData, setFormData, handleInputChange, handleSelectChange };
};

export default function ProfileEditForm() {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    project: "",
    otherProject: "",
  });

  const authToken = useSelector((state: RootState) => state.auth.authToken);
  const currentUser = useMemo(() => decodeJWT(authToken), [authToken]);
  const dispatch = useDispatch();
  const { showSuccess } = useToast();

  const { data: projects, isLoading: isProjectLoading } = useGetProjectsQuery();
  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(
    currentUser.id
  );
  const [createProjectMutation] = useCreateProjectMutation();
  const [updateUserMutation, { isSuccess: isUserUpdateSuccess }] =
    useUpdateUserMutation();
  const { formData, setFormData, handleInputChange, handleSelectChange } =
    useFormState({
      name: "",
      email: "",
      projectId: "",
      otherProject: "",
    });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        projectId: user.project_id?.toString() || "",
        otherProject: "",
      });
    }
  }, [user]);

  // validation
  const validateForm = () => {
    const newErrors = { name: "", email: "", project: "", otherProject: "" };
    let isValid = true;

    if (!formData.name || formData.name.length < 7) {
      newErrors.name = "Name must be at least 7 characters.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.projectId) {
      newErrors.project = "Please select a project.";
      isValid = false;
    }

    if (formData.projectId === "0" && !formData.otherProject) {
      newErrors.otherProject = "Please enter a project name.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let projectId = formData.projectId;

      if (projectId === "0" && formData.otherProject) {
        const project = await createProjectMutation({
          name: formData.otherProject,
          color: PRIMARY_COLOR,
        }).unwrap();
        projectId = project.id.toString();
      }

      await updateUserMutation({
        id: currentUser.id,
        body: {
          name: formData.name,
          email: formData.email,
          projectId,
          is_active: true,
        },
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  useEffect(() => {
    if (isUserUpdateSuccess) {
      showSuccess(
        (
          <div className="text-left">
            <h3 className="font-semibold">User data updated successfully.</h3>
            <p className="mt-1.5 ml-1.5 text-sm text-gray-400">
              You will be redirected to login screen shortly.
            </p>
          </div>
        ) as ReactElement,
        {
          onClose: () => {
            dispatch(logout());
          },
          autoClose: 5000,
        }
      );
    }
  }, [isUserUpdateSuccess]);

  if (isUserLoading) return <ProfileSkeleton />;
  if (!user)
    return (
      <GeneralError errorCode={500} message={MESSAGE.ERROR.UNKNOWN_ERROR} />
    );

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-card rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Edit Profile</h2>
        <p className="text-muted-foreground">
          Update your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Project */}
        <div className="space-y-2">
          <label htmlFor="project" className="text-sm font-medium">
            Project
          </label>
          <Select
            value={formData.projectId || user.project_id.toString()}
            onValueChange={(value) => handleSelectChange("projectId", value)}
          >
            <SelectTrigger id="project" className="w-full">
              {isProjectLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="font-normal text-sm">Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select a project" />
              )}
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
              <SelectItem key="other-item" value="0">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.project && (
            <p className="text-sm text-destructive">{errors.project}</p>
          )}
        </div>

        {/* Other Project */}
        {formData.projectId === "0" && (
          <div className="space-y-2">
            <Input
              id="otherProject"
              name="otherProject"
              type="text"
              value={formData.otherProject}
              onChange={handleInputChange}
              placeholder="Enter your project name"
            />
            {errors.otherProject && (
              <p className="text-sm text-destructive">{errors.otherProject}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <AnimateButton contentText="Save Changes" type="submit" />
        </div>
      </form>
    </div>
  );
}
