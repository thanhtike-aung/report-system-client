import { Dayjs } from "dayjs";
import { Project } from "../project";
import { User } from "../user";

export interface Attendance {
  id: number;
  type: AttendanceType;
  workspace: Workspace;
  project: Project;
  leave_period: LeavePeriod;
  late_minute: number;
  reported_by: number;
  reporter: User;
  status: "pending" | "reported";
  created_by: number;
  creator: User;
  created_at: string;
  updated_at: string;
}

export interface InitialFormState {
  type: string | null;
  workingTime: WorkingTime | null;
  workspace: Workspace | null;
  project: string | null;
  leavePeriod: LeavePeriod | null;
  leaveReason: LeaveReason | string | null;
  otherLeaveReason: string | null;
  lateMinute: Dayjs | null;
  reportedBy: number | null;
  isLate: boolean;
  createdBy: number | null;
}

export interface AttendancePayload {
  type: AttendanceType;
  workingTime: WorkingTime | null;
  workspace: Workspace | null;
  project: string;
  leavePeriod: LeavePeriod | null;
  leaveReason: LeaveReason | string | null;
  otherLeaveReason: any;
  lateMinute: Dayjs | null;
  reportedBy: number | null;
  isLate: boolean;
  createdBy: any;
}

export type AttendanceType = "working" | "leave";

export type WorkingTime = "full" | "morning" | "evening";

export type Workspace = "office" | "home";

export type LeavePeriod = "full" | "morning" | "evening";

export type LeaveReason = "sick" | "personal" | "other";
