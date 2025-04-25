import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Clock,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Report, Task } from "@/types/report";
import { decodeJWT } from "@/utils/jwt";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetProjectsQuery } from "@/redux/apiServices/project";

export default function TaskReportForm() {
  const currentUser = decodeJWT(
    useSelector((state: RootState) => state.auth.authToken)
  );
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      projectId: currentUser.projectId,
      project: currentUser.project,
      title: "",
      description: "",
      progress: null,
      manHours: null,
      isExpanded: false,
    },
  ]);
  // const [projectColor, setProjectColor] = useState<string>("#9e9e9e");

  const [animateProgress, setAnimateProgress] = useState(false);
  const {
    data: projects,
    isLoading: isProjectLoading,
    isSuccess: isProjectSuccess,
  } = useGetProjectsQuery();

  useEffect(() => {
    setAnimateProgress(true);
  }, []);

  const totalHours = tasks.reduce((sum, task) => {
    const hours = Number(task.manHours) || 0;
    return sum + hours;
  }, 0);

  const remainingHours = 8 - totalHours;
  const hoursPercentage = (totalHours / 8) * 100;

  const handleTaskChange = (id: number, field: keyof Task, value: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const toggleExpand = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isExpanded: !task.isExpanded } : task
      )
    );
  };

  const addTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      projectId: null,
      project: "",
      title: "",
      description: "",
      progress: null,
      manHours: null,
      isExpanded: false,
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getProjectColor = (id: number | null) => {
    console.log(projects);
    console.log(id);
    if (!projects || id === null) return "bg-gray-300";
    const project = projects.find((p) => p.id === id);
    return project?.color || "bg-gray-300";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-[#5b87ff] to-[#3b6ae8] rounded-2xl p-6 shadow-lg text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Today&apos;s Progress ({tasks.length})
          </h2>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="font-medium">{remainingHours} hrs remaining</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {Math.round(hoursPercentage)}%</span>
            <span>{totalHours}/8 hours</span>
          </div>
          <Progress
            value={animateProgress ? hoursPercentage : 0}
            className="h-2 bg-white/30"
            indicatorClassName="bg-white transition-all duration-1000 ease-in-out"
          />
        </div>
      </div>

      <div className="space-y-7">
        {tasks.map((task, index) => {
          const progressValue = task.progress;
          const projectColor = getProjectColor(task.projectId);

          return (
            <Card
              key={task.id}
              className="overflow-hidden border-0 pt-0 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <pre>{projectColor}</pre>
              <div className="h-1 rounded-t-md" style={{background: projectColor}}></div>
              <CardContent className="p-5">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-full no-override ${task.isExpanded ? "bg-blue-50" : ""}`}
                        onClick={() => toggleExpand(task.id)}
                      >
                        {task.isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm text-gray-500">
                        Task {index + 1}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-gray-400 no-override hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 no-override" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        Project
                      </div>
                      <Select
                        value={task.projectId?.toString()}
                        onValueChange={(value) =>
                          handleTaskChange(task.id, "projectId", value)
                        }
                      >
                        <SelectTrigger className="w-full !bg-gray-100 !px-3 !border-0 focus:ring-2 ring-[#5b87ff]/20">
                          <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects &&
                            projects.map((project) => (
                              <SelectItem
                                key={project.id}
                                value={project.id.toString()}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2 h-2 rounded-full" style={{background: project.color}}
                                  ></span>
                                  {project.name}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-5 space-y-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Task<span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="What are you working on?"
                        value={task.title}
                        onChange={(e) =>
                          handleTaskChange(task.id, "title", e.target.value)
                        }
                        className="!bg-gray-100 border-0 focus:ring-2 ring-[#5b87ff]/20"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Progress
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          value={task.progress || ""}
                          onChange={(e) =>
                            handleTaskChange(
                              task.id,
                              "progress",
                              e.target.value
                            )
                          }
                          className="pr-8 !bg-gray-100 border-0 focus:ring-2 ring-[#5b87ff]/20"
                        />
                        <span className="absolute right-18 top-1/2 -translate-y-1/2 text-gray-500">
                          %
                        </span>
                      </div>
                      <Progress
                        value={progressValue}
                        className="h-1 mt-1 bg-gray-100"
                        indicatorClassName={projectColor}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Hours<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        value={task.manHours || ""}
                        onChange={(e) =>
                          handleTaskChange(task.id, "manHours", e.target.value)
                        }
                        className="!bg-gray-100 border-0 focus:ring-2 ring-[#5b87ff]/20"
                      />
                    </div>
                  </div>

                  {task.isExpanded && (
                    <div className="pt-3 mt-2 border-t">
                      <Textarea
                        placeholder="Add details about this task..."
                        value={task.description}
                        onChange={(e) =>
                          handleTaskChange(
                            task.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="min-h-[100px] w-full !bg-gray-100 border-0 focus:ring-2 ring-[#5b87ff]/20"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={addTask}
          className="bg-gradient-to-r from-[#5b87ff] to-[#3b6ae8] hover:from-[#4a76ee] hover:to-[#2a59d7] text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="text-center text-xs text-gray-500">
        Press Ctrl + Enter to quickly add a new task
      </div>
    </div>
  );
}
