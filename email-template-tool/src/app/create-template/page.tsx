'use client';

import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import TemplateEditor from '@/components/TemplateEditor';
import LoginPage from '@/components/LoginPage';
import { CircularProgress, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function CreateTemplatePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

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

  const handleSave = () => {
    // Redirect to dashboard after successful save
    router.push('/');
  };

  return (
    <>
      <Header currentPage="create" />
      <TemplateEditor onSave={handleSave} />
    </>
  );
}