import { Project } from "../project";
import { Report } from "../report";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  workflows_url: string;
  is_active: boolean;
  can_report: boolean;
  supervisor_id: number | null;
  supervisor?: User;
  subordinates?: User[];
  project_id: number;
  project?: Project;
  reports?: Report[];
}

export interface UserPayload {
  name?: string;
  email?: string;
  role?: Role;
  workflowsUrl?: string;
  isActive?: boolean;
  canReport?: boolean;
  projectId?: string;
  supervisorId?: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  project: string;
  exp: number;
}

export type Role =
  | "rootadmin"
  | "manager"
  | "bse"
  | "leader"
  | "subleader"
  | "member";
