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
} from "@/constants/attendance";
import { Input } from "@/components/ui/input";
import Switch from "@mui/material/Switch";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CurrentUser, User } from "@/types/user";
import { decodeJWT } from "@/utils/jwt";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { Loader2 } from "lucide-react";
import { MESSAGE } from "@/constants/messages";
import {
  AttendanceType,
  LeavePeriod,
  WorkingTime,
  Workspace,
} from "@/types/attendance";
import { get } from "@/utils/fetch/get";
import useToast from "@/hooks/useToast";
import { useCreateAttendanceMutation } from "@/redux/apiServices/attendance";

const getInitialFormState = () => ({
  member: "",
  type: "",
  workingTime: "",
  workspace: "",
  project: "",
  leavePeriod: "",
  leaveReason: "",
  otherLeaveReason: "",
  isLate: false,
  lateMinute: dayjs(),
  reportBy: 0,
  createdBy: 0,
});

export default function OtherAttendanceForm() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [formState, setFormState] = useState(getInitialFormState());
  const [storedAuthToken, ,] = useLocalStorage<string | null>(
    "auth-token",
    null
  );
  const [
    createAttendanceMutation,
    {
      isLoading: isSubmitLoading,
      isSuccess: isSubmitSuccess,
      isError: isSubmitError,
    },
  ] = useCreateAttendanceMutation();
  const { showSuccess, showError } = useToast();

  const handleChange = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const isDisable = (): boolean => {
    if (!member || !type) return true;
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

    try {
      await createAttendanceMutation({
        type: type as AttendanceType,
        workingTime:
          type === TYPE.WORKING ? (workingTime as WorkingTime) : null,
        workspace:
          leavePeriod !== LEAVE_PERIOD.FULL ? (workspace as Workspace) : null,
        project:
          users?.find((user) => user.id === Number(member))?.project?.name ||
          "",
        createdBy: currentUser?.id || 0,
        reportedBy: Number(member),
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
    if (!currentUser) return;

    // get all users except current logged-in user for memeber select box
    get(`${import.meta.env.VITE_API_URL}/users/not/${currentUser.id}`)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error(error);
      });

    setFormState((prevState) => ({
      ...prevState,
      reportBy: currentUser?.id || 1,
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
    showSuccess("Attendance reported successfully 🎉");
    setFormState(getInitialFormState());
  }, [isSubmitSuccess, isSubmitError]);

  const {
    member,
    type,
    workingTime,
    workspace,
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member */}
            <div className="space-y-2">
              <Label htmlFor="type">Member</Label>
              <Select
                value={member}
                onValueChange={(value) => handleChange("member", value)}
              >
                <SelectTrigger id="member" className="w-full">
                  <SelectValue placeholder="Choose member" />
                </SelectTrigger>
                <SelectContent>
                  {users &&
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

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
          </form>
        </CardContent>
        <CardFooter>
          {isSubmitLoading ? (
            <Button className="w-full custom-primary" disabled>
              Reporting
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full custom-primary custom-animate-button"
              disabled={isDisable()}
              onClick={handleSubmit}
            >
              Report
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
