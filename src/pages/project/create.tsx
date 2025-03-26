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
import { MESSAGE } from "@/constants/messages";
import useToast from "@/hooks/useToast";
import { useCreateProjectMutation } from "@/redux/apiServices/project";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const ProjectCreateForm = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [createProjectMutation, { isLoading, isSuccess }] =
    useCreateProjectMutation();
  const { showSuccess } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!projectName) return;
      await createProjectMutation({ name: projectName });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isSuccess) return;
    setProjectName("");
    showSuccess(`Project ${MESSAGE.SUCCESS.CREATED}`);
  }, [isSuccess]);

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Create your project for reporting.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name of your project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-5">
            <Button
              type="submit"
              className="w-full custom-primary custom-animate-button"
              disabled={!projectName || isLoading}
            >
              {isLoading ? (
                <>
                  Creating
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                <>Create</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default ProjectCreateForm;
