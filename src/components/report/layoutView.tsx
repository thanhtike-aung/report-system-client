import { HALF_WORKING_TIME } from "@/constants";
import { cn } from "@/lib/utils";
import { useGetAuthorizedReportersWithUsersAndReportsQuery } from "@/redux/apiServices/user";
import { Report } from "@/types/report";
import { User } from "@/types/user";
import { isSameDay, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Users, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface props {
  date: Date;
}

interface MemberData {
  name: string;
  projectName: string;
  reports: Report[];
  teamIndex?: number; // for team color
}

interface TeamData {
  name: string;
  members: MemberData[];
}

const LayoutView: React.FC<props> = ({ date }) => {
  const [teamsData, setTeamsData] = useState<TeamData[] | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [selectedMemberReports, setSelectedMemberReports] = useState<
    Report[] | null
  >(null);
  const {
    data: reportSenders,
    isSuccess,
  } = useGetAuthorizedReportersWithUsersAndReportsQuery();
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const handleTeamSelect = (team: TeamData) => {
    setSelectedTeam(team);
    setSelectedMember(null);
  };

  const handleMemberSelect = (member: MemberData) => {
    setSelectedMember(member);
  };

  const closeMemberReport = () => {
    setSelectedMember(null);
  };

  const getTeamColor = (index: number): string => {
    const colors = ["bg-[#6C63FF]", "bg-[#3A86B8]", "bg-[#264653]"];
    return colors[index % colors.length];
  };

  useEffect(() => {
    if (!isSuccess) return;
    const transformedUsers = reportSenders.flatMap((sender: User) => {
      const transformedSupervisor = {
        name: sender.name,
        projectName: sender.project?.name ?? "",
        reports: sender.reports ?? [],
      };
      const transformedSubordinates = (sender.subordinates ?? []).map(
        (subordinate: User) => ({
          name: subordinate.name,
          projectName: subordinate.project?.name ?? "",
          reports: subordinate.reports ?? [],
        })
      );
      return {
        name: `${sender.name}'s Team`,
        members: [transformedSupervisor, ...transformedSubordinates],
      };
    });
    setTeamsData(transformedUsers);
  }, [isSuccess]);

  useEffect(() => {
    if (!selectedMember) return;
    const filteredReports = selectedMember.reports.filter((filteredReport) =>
      isSameDay(parseISO(filteredReport.updated_at), date)
    );
    setSelectedMemberReports(filteredReports);
  }, [selectedMember, date]);

  if (!teamsData) return "nth";

  return (
    <>
      <div className="space-y-6">
        {/* Teams */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {teamsData.map((team, index) => (
            <div
              key={index}
              className={cn(
                "cursor-pointer rounded-lg p-1 transition-all duration-200",
                selectedTeam?.name === team.name
                  ? "ring-2 ring-offset-2"
                  : "hover:bg-white/50",
                getTeamColor(index).replace("bg-", "ring-")
              )}
              onClick={() => handleTeamSelect(team)}
            >
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg p-6 h-[100px] text-white",
                  getTeamColor(index),
                  selectedTeam?.name === team.name
                    ? "opacity-100"
                    : "opacity-90 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">{team.name}</h2>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <span className="text-sm font-medium">
                    {team.members.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Member List */}
        <AnimatePresence>
          {selectedTeam !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-semibold text-slate-800">
                {selectedTeam?.name} Members ({selectedTeam?.members.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {selectedTeam?.members.map((member: MemberData) => (
                  <div
                    key={member.name}
                    onClick={() => handleMemberSelect(member)}
                    className={cn(
                      "cursor-pointer rounded-md border p-3 transition-all duration-200",
                      selectedMember?.name === member.name
                        ? `border-2 ${getTeamColor(
                            teamsData.findIndex(
                              (t) => t.name === selectedTeam.name
                            )
                          ).replace("bg-", "border-")}`
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-white",
                            getTeamColor(
                              teamsData.findIndex(
                                (t) => t.name === selectedTeam.name
                              )
                            )
                          )}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">
                          {member.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-slate-500">
                          {member.projectName}
                        </span>
                        <ChevronRight className="ml-1 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Member Report */}
        <AnimatePresence>
          {selectedMember !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-lg bg-white p-4 shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  Daily Report
                </h3>
                <button
                  onClick={closeMemberReport}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-100 no-override"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                ref={reportContainerRef}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <h5 className="font-semibold text-xl mb-2">■今日の作業実績</h5>
                {selectedMemberReports?.map((report: Report, index: number) =>
                  report.working_time > 0 ? (
                    <div key={report.id} className="mt-2.5">
                      <p>
                        {index + 1})【{report.project}】{report.task_title}
                      </p>
                      {report.task_description && (
                        <span className="text-gray-500 text-sm">
                          &nbsp;&nbsp;&nbsp;⟹ {report.task_description}
                        </span>
                      )}
                      {report.working_time === HALF_WORKING_TIME && (
                        <span className="text-gray-500">⟹ Half Leave</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">⟹ Full Leave</p>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LayoutView;
