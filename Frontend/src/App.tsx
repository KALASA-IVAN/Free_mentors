import React from 'react'
import { Container, Typography, Button } from "@mui/material"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import MentorsList from './components/MentorsList';
import UserSessions from './components/UserSessions';
function App() {

  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/mentors" element={<MentorsList />} />
          <Route path="/requests" element={<UserSessions />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App
