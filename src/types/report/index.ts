export interface Report {
  id: number;
  project: string;
  task_title: string;
  task_description: string;
  progress: number;
  man_hour: number;
  user_id: number;
}

export interface Task {
  id: number;
  projectId: number | null;
  project: string;
  title: string;
  description: string;
  progress: number;
  manHours: number;
  isExpanded: boolean;
}
