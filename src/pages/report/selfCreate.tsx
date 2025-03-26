import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  LEAVE_PERIOD,
  LEAVE_REASON,
  TYPE,
  WORKING_TIME,
  WORKSPACE,
} from "@/constants/report";
import { Input } from "@/components/ui/input";
import Switch from "@mui/material/Switch";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useCreateReportMutation } from "@/redux/apiServices/report";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CurrentUser } from "@/types/user";
import { decodeJWT } from "@/utils/jwt";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { Loader2 } from "lucide-react";
import { MESSAGE } from "@/constants/messages";
import {
  LeavePeriod,
  ReportType,
  WorkingTime,
  Workspace,
} from "@/types/report";
import useToast from "@/hooks/useToast";

const getInitialFormState = () => ({
  type: "",
  workingTime: "",
  workspace: "",
  project: "",
  leavePeriod: "",
  leaveReason: "",
  otherLeaveReason: "",
  isLate: false,
  lateMinute: dayjs(),
  reportedBy: 0,
  createdBy: 0,
});

export default function SelfReportForm() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [formState, setFormState] = useState(getInitialFormState());
  const [storedAuthToken, ,] = useLocalStorage<string | null>(
    "auth-token",
    null
  );
  const [
    createReportMutation,
    {
      isLoading: isSubmitLoading,
      isSuccess: isSubmitSuccess,
      isError: isSubmitError,
    },
  ] = useCreateReportMutation();
  const { showSuccess, showError } = useToast();

  const handleChange = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const isDisable = (): boolean => {
    if (!type) return true;
    if (type === TYPE.WORKING) {
      if (workingTime !== WORKING_TIME.FULL) {
        return (
          !leaveReason ||
          (leaveReason === LEAVE_REASON.OTHER && !otherLeaveReason)
        );
      }
      return !workingTime || !workspace;
    }
    if (type === TYPE.LEAVE) {
      if (leavePeriod !== LEAVE_PERIOD.FULL) {
        return !workspace;
      }
      return (
        !leavePeriod ||
        !leaveReason ||
        (leaveReason === LEAVE_REASON.OTHER && !otherLeaveReason)
      );
    }
    return false;
  };

  /**
   * submit form
   * @param e
   * @returns
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    console.log(reportedBy);

    try {
      await createReportMutation({
        type: type as ReportType,
        workingTime:
          type === TYPE.WORKING ? (workingTime as WorkingTime) : null,
        workspace:
          leavePeriod !== LEAVE_PERIOD.FULL ? (workspace as Workspace) : null,
        project: project,
        createdBy: currentUser?.id || 0,
        reportedBy: currentUser?.id || 0,
        isLate: isLate,
        lateMinute: isLate ? lateMinute : null,
        leavePeriod: type === TYPE.LEAVE ? (leavePeriod as LeavePeriod) : null,
        leaveReason: workingTime !== WORKING_TIME.FULL ? leaveReason : null,
        otherLeaveReason:
          leaveReason === LEAVE_REASON.OTHER ? otherLeaveReason : null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCurrentUser(decodeJWT(storedAuthToken));
  }, [storedAuthToken]);

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      project: currentUser?.project || "",
      reportedBy: currentUser?.id || 0,
      createdBy: currentUser?.id || 0,
    }));
  }, [currentUser]);

  useEffect(() => {
    if (formState.type === TYPE.WORKING) {
      setFormState((prevState) => ({
        ...prevState,
        leavePeriod: "",
        leaveReason: "",
        otherLeaveReason: "",
      }));
    } else if (formState.type === TYPE.LEAVE) {
      setFormState((prevState) => ({
        ...prevState,
        workingTime: "",
        workspace: "",
        isLate: false,
        lateMinute: dayjs(),
      }));
    }
  }, [formState.type]);

  useEffect(() => {
    if (isSubmitError) {
      showError(MESSAGE.ERROR.UNKNOWN_ERROR);
      return;
    }
    if (!isSubmitSuccess) return;
    showSuccess("Reported successfully 🎉");
    setFormState(getInitialFormState());
  }, [isSubmitSuccess, isSubmitError]);

  const {
    type,
    workingTime,
    workspace,
    project,
    reportedBy,
    leavePeriod,
    leaveReason,
    isLate,
    lateMinute,
    otherLeaveReason,
  } = formState;

  return (
    <>
      <Card className="w-full max-w-md mx-auto my-auto">
        <CardHeader>
          <CardTitle>Work Preferences</CardTitle>
          <CardDescription>Set your work type and preferences</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TYPE.WORKING}>Working</SelectItem>
                  <SelectItem value={TYPE.LEAVE}>Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Working Time */}
            {type === TYPE.WORKING && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="workingTime">Working Time</Label>
                  <Select
                    value={workingTime}
                    onValueChange={(value) =>
                      handleChange("workingTime", value)
                    }
                  >
                    <SelectTrigger id="workingTime" className="w-full">
                      <SelectValue placeholder="Choose working time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={WORKING_TIME.FULL}>Full</SelectItem>
                      <SelectItem value={WORKING_TIME.MORNING}>
                        Morning
                      </SelectItem>
                      <SelectItem value={WORKING_TIME.EVENING}>
                        Evening
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Leave Period */}
            {type === TYPE.LEAVE && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="leavePeriod">Leave Period</Label>
                  <Select
                    value={leavePeriod}
                    onValueChange={(value) =>
                      handleChange("leavePeriod", value)
                    }
                  >
                    <SelectTrigger id="leavePeriod" className="w-full">
                      <SelectValue placeholder="Choose leave period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={WORKING_TIME.FULL}>Full</SelectItem>
                      <SelectItem value={WORKING_TIME.MORNING}>
                        Morning
                      </SelectItem>
                      <SelectItem value={WORKING_TIME.EVENING}>
                        Evening
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Workspace */}
            {(workingTime ||
              (leavePeriod && leavePeriod !== LEAVE_PERIOD.FULL)) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="workspace">Workspace</Label>
                  <Select
                    value={workspace}
                    onValueChange={(value) => handleChange("workspace", value)}
                  >
                    <SelectTrigger id="workspace" className="w-full">
                      <SelectValue placeholder="Choose workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={WORKSPACE.OFFICE}>Office</SelectItem>
                      <SelectItem value={WORKSPACE.HOME}>Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Leave Reason */}
            {(leavePeriod ||
              (workingTime && workingTime !== WORKING_TIME.FULL)) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="leaveReason">Leave Reason</Label>
                  <Select
                    value={leaveReason}
                    onValueChange={(value) =>
                      handleChange("leaveReason", value)
                    }
                  >
                    <SelectTrigger id="leaveReason" className="w-full">
                      <SelectValue placeholder="Choose leave reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LEAVE_REASON.SICK}>Sick</SelectItem>
                      <SelectItem value={LEAVE_REASON.PERSONAL}>
                        Personal
                      </SelectItem>
                      <SelectItem value={LEAVE_REASON.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {leaveReason === LEAVE_REASON.OTHER && (
                  <div>
                    <Input
                      className="w-full !border-[#b2b8b5]"
                      placeholder="Enter your leave reason"
                      onChange={(e) =>
                        handleChange("otherLeaveReason", e.target.value)
                      }
                    />
                  </div>
                )}
              </>
            )}

            {/* Is Late */}
            {workspace && (
              <>
                <div className="space-y-2">
                  <Label>Is late?</Label>
                  <Switch
                    checked={isLate}
                    onChange={(e) => handleChange("isLate", e.target.checked)}
                  />
                </div>

                {isLate && (
                  <div className="space-y-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <StaticTimePicker
                        sx={{
                          "& .MuiDialogActions-root": {
                            display: "none",
                          },
                          "& .MuiTimePickerToolbar-root": {
                            paddingY: 0,
                          },
                        }}
                        defaultValue={dayjs()}
                        value={lateMinute}
                        onChange={(value) => handleChange("lateMinute", value)}
                      />
                    </LocalizationProvider>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="mt-5">
            {isSubmitLoading ? (
              <Button className="w-full" disabled>
                Reporting
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full custom-primary custom-animate-button"
                disabled={isDisable()}
              >
                Report
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
