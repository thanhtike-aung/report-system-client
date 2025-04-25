import { User } from "../user";

export interface Project {
  id: number;
  name: string;
  color: string;
  updated_at: string;
  users: User[];
}
