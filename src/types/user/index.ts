import { Project } from "../project";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  supervisor_id: number | null;
  supervisor?: User;
  project_id: number;
  project?: Project;
}

export interface UserPayload {
  name: string;
  email: string;
  role?: Role;
  projectId: string;
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
