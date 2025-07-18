export interface Report {
  id: number;
  project: string;
  task_title: string;
  task_description: string;
  progress: number;
  man_hours: number;
  working_time: number;
  updated_at: string;
  user_id: number;
  status: string;
}

export interface Task {
  id: number;
  project: {
    id: number | null;
    name: string;
  };
  title: string;
  description: string;
  progress: number | null;
  manHours: number | null;
  isExpanded: boolean;
}
