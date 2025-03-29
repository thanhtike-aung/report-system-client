import ProtectedRoute from "@/components/protectedRoute";
import UnderConstruction from "@/components/underConstruction";
import { Sidebar } from "@/layout/sidebar";
import LoginForm from "@/pages/auth/loginForm";
import PasswordChangeForm from "@/pages/auth/passwordChangeForm";
import ProjectCreateForm from "@/pages/project/create";
import ProjectList from "@/pages/project/list";
import OtherReportForm from "@/pages/report/otherCreate";
import SelfReportForm from "@/pages/report/selfCreate";
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

                  {/* report */}
                  <Route path="/" element={<SelfReportForm />} />
                  <Route path="/report/self" element={<SelfReportForm />} />
                  <Route path="/report/other" element={<OtherReportForm />} />
                  <Route path="/report" element={<UnderConstruction />} />

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
