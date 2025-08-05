'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import { CircularProgress, Box } from '@mui/material';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <Header currentPage="home" />
      <Dashboard />
    </>
  );
}
