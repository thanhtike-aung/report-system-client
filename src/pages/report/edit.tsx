import { useState, useEffect, ReactElement } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Clock,
  BarChart3,
  Briefcase,
  PackageCheck,
  Loader2,
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
import { FULL_WORKING_TIME, GRAY_COLOR, HALF_WORKING_TIME } from "@/constants";
import { useGetAttendanceByIdAndDateQuery } from "@/redux/apiServices/attendance";
import { format } from "date-fns";
import { TYPE } from "@/constants/attendance";
import { useUpdateReportMutation } from "@/redux/apiServices/report";
import useToast from "@/hooks/useToast";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";
import { useGetTodayReportQuery } from "@/redux/apiServices/report";

// TaskCard component remains the same as in create.tsx
const TaskCard = ({
  task,
  index,
  projects,
  onTaskChange,
  onToggleExpand,
  onRemoveTask,
  getProjectColor,
  addTask,
}: {
  task: Task;
  index: number;
  projects: any[];
  onTaskChange: (id: number, field: keyof Task, value: any) => void;
  onToggleExpand: (id: number) => void;
  onRemoveTask: (id: number) => void;
  getProjectColor: (id: number | null) => string;
  addTask: () => void;
}) => {
  const projectColor = getProjectColor(task.project.id);

  return (
    <Card
      key={task.id}
      className="overflow-hidden pt-0 shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div
        className="h-1 rounded-t-md"
        style={{ background: projectColor }}
      ></div>
      <CardContent className="p-5">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full no-override ${
                  task.isExpanded ? "bg-blue-50" : ""
                }`}
                onClick={() => onToggleExpand(task.id)}
              >
                {task.isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <span className="text-sm text-gray-500">Task {index + 1}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gray-400 no-override hover:text-red-500 hover:bg-red-50"
              onClick={() => onRemoveTask(task.id)}
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
                value={task.project.id?.toString()}
                onValueChange={(value) => {
                  const selectedProject = projects.find(
                    (project) => project.id.toString() === value
                  );
                  if (selectedProject) {
                    onTaskChange(task.id, "project", {
                      id: selectedProject.id,
                      name: selectedProject.name,
                    });
                  }
                }}
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
                            className="w-2 h-2 rounded-full"
                            style={{ background: project.color }}
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
                onChange={(e) => onTaskChange(task.id, "title", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    addTask();
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    onTaskChange(task.id, "isExpanded", true);
                  }
                }}
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
                    onTaskChange(task.id, "progress", e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      addTask();
                    }
                  }}
                  className="pr-8 !bg-gray-100 border-0 focus:ring-2 ring-[#5b87ff]/20"
                />
                <span className="absolute right-18 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              <Progress
                value={task.progress || 0}
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
                  onTaskChange(task.id, "manHours", e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    addTask();
                  }
                }}
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
                  onTaskChange(task.id, "description", e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    addTask();
                  }
                }}
                className="min-h-[100px] w-full !bg-gray-100 border-0 focus:ring-2 ring-[#5b87ff]/20"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const ReportEditForm = () => {
  const navigate = useNavigate();
  const [workingTime, setWorkingTime] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [modifiedProjects, setModifiedProjects] = useState<Project[] | null>(
    null
  );
  const [headBannerColor, setHeadBannerColor] = useState<{
    from: string;
    to: string;
  }>({
    from: "#5b87ff",
    to: "#3b6ae8",
  });
  const currentUser = decodeJWT(
    useSelector((state: RootState) => state.auth.authToken)
  );
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      project: {
        id: currentUser.projectId,
        name: currentUser.project,
      },
      title: "",
      description: "",
      progress: null,
      manHours: null,
      isExpanded: false,
    },
  ]);

  const [animateProgress, setAnimateProgress] = useState(false);
  const { data: projects, isSuccess: isProjectSuccess } = useGetProjectsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );
  const { data: attendance, isSuccess: isAttendanceSuccess } =
    useGetAttendanceByIdAndDateQuery(
      { id: currentUser.id, date: format(new Date(), "yyyy-MM-dd") },
      { refetchOnMountOrArgChange: true }
    );
  const { data: todayReport, isSuccess: isTodayReportSuccess } = useGetTodayReportQuery(
    { userId: currentUser.id, status: "pending" },
    { refetchOnMountOrArgChange: true }
  );
  const [
    updateReportMutation,
    { isLoading: isReportUpdating, isSuccess: isReportUpdateSuccess },
  ] = useUpdateReportMutation();
  const { showSuccess, showWarning } = useToast();

  useEffect(() => {
    setAnimateProgress(true);
  }, []);

  useEffect(() => {
    if (!isProjectSuccess) return;
    const newProjects = [
      ...projects,
      { id: 998, name: "自己学習", color: "#ff9c59" },
      { id: 999, name: "その他", color: "#a8024d" },
    ];
    setModifiedProjects(newProjects);
  }, [isProjectSuccess]);

  useEffect(() => {
    const hours = tasks.reduce((sum, task) => {
      const hours = Number(task.manHours) || 0;
      return sum + hours;
    }, 0);
    setTotalHours(hours);
  }, [tasks]);

  useEffect(() => {
    if (!isAttendanceSuccess) return;

    if (attendance === null) {
      showWarning(
        (
          <div className="text-left">
            <h4 className="font-semibold">
              You haven't report your morning attendance.
            </h4>
            <p className="mt-1.5 text-sm">Please report attendance first.</p>
          </div>
        ) as ReactElement,
        {
          autoClose: 5000,
          className: "!w-[410px]",
        }
      );
      return;
    }
    if (attendance?.type === TYPE.WORKING) {
      setWorkingTime(FULL_WORKING_TIME);
      return;
    }
    if (attendance?.type === TYPE.LEAVE && attendance.workspace !== null) {
      setWorkingTime(HALF_WORKING_TIME);
      return;
    }
  }, [attendance]);

  useEffect(() => {
    if (totalHours > workingTime) {
      setHeadBannerColor({ from: "#b86051", to: "#852211" });
    } else if (totalHours === workingTime && totalHours !== 0) {
      setHeadBannerColor({ from: "#53784f", to: "#43753e" });
    } else if (totalHours < workingTime) {
      setHeadBannerColor({ from: "#5b87ff", to: "#3b6ae8" });
    }
  }, [totalHours]);

  useEffect(() => {
    if (!isReportUpdateSuccess) return;
    showSuccess("Your report has been updated successfully.");
    navigate("/reports");
  }, [isReportUpdateSuccess]);

  // Add effect to populate tasks from today's report
  useEffect(() => {
    if (!isTodayReportSuccess || !todayReport || todayReport.length === 0) return;
    
    const transformedTasks = todayReport.map((report: Report, index: number) => ({
      id: index + 1,
      project: {
        id: modifiedProjects?.find(p => p.name === report.project)?.id || null,
        name: report.project,
      },
      title: report.task_title,
      description: report.task_description,
      progress: report.progress,
      manHours: report.man_hours,
      isExpanded: false,
    }));
    
    setTasks(transformedTasks);
    setWorkingTime(todayReport[0].working_time);
  }, [isTodayReportSuccess, todayReport, modifiedProjects]);

  const remainingHours = workingTime - totalHours;
  const hoursPercentage = (totalHours / workingTime) * 100;

  const handleTaskChange = (id: number, field: keyof Task, value: any) => {
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
    if (tasks.length === 10) return;
    const newTask: Task = {
      id: tasks.length + 1,
      project: {
        id: null,
        name: "",
      },
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
    if (!modifiedProjects) return GRAY_COLOR;
    const project = modifiedProjects.find((p) => p.id === Number(id));
    return project?.color || GRAY_COLOR;
  };

  const isDisabled = (): boolean => {
    return tasks.some(
      (task) =>
        task.project.id === null ||
        task.title === "" ||
        task.manHours?.toString() === ""
    );
  };

  const updateReport = async () => {
    const tasksPayload = tasks.map((task) => {
      return {
        task_title: task.title,
        task_description: task.description,
        project: task.project.name,
        progress: Number(task.progress),
        man_hours: Number(task.manHours),
        working_time: workingTime,
        user_id: currentUser.id,
      };
    });
    await updateReportMutation({ id: currentUser.id, body: tasksPayload });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Preview */}
      <div className="sticky top-4 z-10 mb-8">
        <div
          className="bg-gradient-to-r rounded-2xl p-6 shadow-lg text-white"
          style={{
            backgroundImage: `linear-gradient(to right, ${headBannerColor.from}, ${headBannerColor.to})`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Edit Today&apos;s Report ({tasks.length})
            </h2>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">
                {remainingHours} hrs remaining
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {Math.round(hoursPercentage)}%</span>
              <span>
                {totalHours}/{workingTime} hours
              </span>
            </div>
            <Progress
              value={animateProgress ? hoursPercentage : 0}
              className="h-2 bg-white/30"
              indicatorClassName="bg-white transition-all duration-1000 ease-in-out"
            />
          </div>
        </div>
      </div>

      <div className="space-y-7">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            projects={modifiedProjects || []}
            onTaskChange={handleTaskChange}
            onToggleExpand={toggleExpand}
            onRemoveTask={removeTask}
            getProjectColor={getProjectColor}
            addTask={addTask}
          />
        ))}
      </div>

      {totalHours === workingTime ? (
        <div className="flex justify-center">
          <Button
            onClick={updateReport}
            className="bg-gradient-to-r from-[#5b87ff] to-[#3b6ae8] hover:from-[#4a76ee] hover:to-[#2a59d7] text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-200"
            disabled={isDisabled() || isReportUpdating}
          >
            {isReportUpdating ? (
              <>
                <Loader2 className="animate-spin" />
                Updating
              </>
            ) : (
              <>
                <PackageCheck className="h-4 w-4 mr-2" />
                Update Report
              </>
            )}
          </Button>
        </div>
      ) : totalHours < workingTime ? (
        <>
          <div className="flex justify-center mb-1.5">
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
        </>
      ) : null}
    </div>
  );
};

export default ReportEditForm; 