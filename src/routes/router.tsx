import ProtectedRoute from "@/components/protectedRoute";
import { Sidebar } from "@/layout/sidebar";
import AttendanceList from "@/pages/attendance/list";
import OtherAttendanceForm from "@/pages/attendance/otherCreate";
import SelfAttendanceForm from "@/pages/attendance/selfCreate";
import LoginForm from "@/pages/auth/loginForm";
import PasswordChangeForm from "@/pages/auth/passwordChangeForm";
import ProjectCreateForm from "@/pages/project/create";
import ProjectList from "@/pages/project/list";
import TaskReportForm from "@/pages/report/create";
import ReportList from "@/pages/report/list";
import MemberCreateForm from "@/pages/user/create";
import MemberEditForm from "@/pages/user/edit";
import MemberList from "@/pages/user/list";
import ProfileEditForm from "@/pages/user/profile";
import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <Routes>
                  {/* auth */}
                  <Route
                    path="password/edit"
                    element={<PasswordChangeForm />}
                  />

                  {/* attendance */}
                  <Route
                    path="/attendances/self"
                    element={<SelfAttendanceForm />}
                  />
                  <Route
                    path="/attendances/other"
                    element={<OtherAttendanceForm />}
                  />
                  <Route path="/attendances" element={<AttendanceList />} />

                  {/* report */}
                  <Route path="/reports/add" element={<TaskReportForm />} />
                  <Route path="/reports" element={<ReportList />} />

                  {/* user */}
                  <Route path="/members/add" element={<MemberCreateForm />} />
                  <Route path="/members" element={<MemberList />} />
                  <Route
                    path="/members/:id/edit"
                    element={<MemberEditForm />}
                  />
                  <Route path="/profile/edit" element={<ProfileEditForm />} />

                  {/* project */}
                  <Route path="/projects" element={<ProjectList />} />
                  <Route path="/projects/add" element={<ProjectCreateForm />} />
                </Routes>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
