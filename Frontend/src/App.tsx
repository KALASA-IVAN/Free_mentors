import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./redux/protectedRoutes";

import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import MentorsList from "./components/MentorsList";
import UserSessions from "./components/UserSessions";
import MentorSessions from "./components/MentorSessions";
import AdminDashboard from "./components/AdminsDashboard";
import UserManagement from "./components/UserManagement";
import Unauthorized from "./components/Unauthorized";

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          {/* Public Routes */}
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/requests" element={<UserSessions />} />
          </Route>

          {/* Mentor-Only Routes */}
          <Route element={<ProtectedRoute requireMentor />}>
            <Route path="/mentees" element={<MentorSessions />} />
          </Route>

          {/* Admin-Only Routes */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

          {/* Accessible to all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mentors" element={<MentorsList />} />
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
