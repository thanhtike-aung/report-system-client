import { Dayjs } from "dayjs";

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

export interface ReportPayload {
  type: ReportType;
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

export type ReportType = "working" | "leave";

export type WorkingTime = "full" | "morning" | "evening";

export type Workspace = "office" | "home";

export type LeavePeriod = "full" | "morning" | "evening";

export type LeaveReason = "sick" | "personal" | "other";
