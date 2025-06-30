import { LEAVE_PERIOD, TYPE, WORKSPACE } from "@/constants/attendance";
import { Attendance } from "@/types/attendance";
import dayjs from "dayjs";

const determineWorkingTime = (leavePeriod: string) => {
  if (leavePeriod === LEAVE_PERIOD.MORNING) return "evening";
  if (leavePeriod === LEAVE_PERIOD.EVENING) return "morning";
  return "";
};

export const copyAttendanceWithFormat = async (
  attendances: Attendance[]
): Promise<boolean> => {
  const officeAttendances = attendances
    .filter(
      (attendance) =>
        attendance.type === TYPE.WORKING &&
        attendance.workspace === WORKSPACE.OFFICE
    )
    .map((attendance) => attendance);
  const homeAttendances = attendances
    .filter((attendance) => attendance.workspace === WORKSPACE.HOME)
    .map((attendance) => attendance);
  const leaveAttendances = attendances
    .filter((attendance) => attendance.type === TYPE.LEAVE)
    .map((attendance) => attendance);

  const padNameList = [
    ...officeAttendances,
    ...homeAttendances,
    ...leaveAttendances,
  ];
  const maxNameLength = Math.max(
    ...padNameList.map((p: any) => p.reporter.name.length)
  );

  const makeLine = (
    i: number,
    name: string,
    project: string,
    leavePeriod?: string
  ) => {
    const padded = name.padEnd(maxNameLength + 2, " ");
    return `${i}. ${padded} (${project}) ${leavePeriod ? "【" + determineWorkingTime(leavePeriod) + "】" : ""}`;
  };

  try {
    const lines = [];

    // header
    lines.push(`${dayjs().format("YYYY.MM.DD")} の勤怠状況を報告いたします。`);
    lines.push(`合計：${attendances.length}名`);
    lines.push(`出勤：${officeAttendances.length}名`);
    lines.push("");

    // office attendance section
    lines.push(`▼ オフィス勤務(${officeAttendances.length}名)`);
    officeAttendances.forEach((attendance: any, index: number) =>
      lines.push(
        makeLine(index + 1, attendance.reporter.name, attendance.project)
      )
    );
    lines.push("");

    // home attendance section
    lines.push(`在宅勤務(${homeAttendances.length}名)`);
    homeAttendances.forEach((attendance: any, index: number) => {
      console.log("attendance: ", attendance);
      return lines.push(
        makeLine(
          index + 1 + officeAttendances.length,
          attendance.reporter.name,
          attendance.project,
          attendance.leave_period
        )
      );
    });
    lines.push("");

    // leave attendance section
    lines.push(`欠勤：${leaveAttendances.length}名`);
    leaveAttendances.forEach((attendance: any, index: number) =>
      lines.push(
        `${index + 1}. ${attendance.reporter.name.padEnd(maxNameLength + 2)}(${attendance.leave_reason})${attendance.leave_period ? `【${attendance.leave_period}】` : ""}`
      )
    );
    lines.push("");

    lines.push("以上です。よろしくお願いいたします。");

    const finalText = lines.join("\n");
    await navigator.clipboard.writeText(finalText);
    return true;
  } catch (error) {
    console.error("Failed to copy attendance:", error);
    return false;
  }
};
