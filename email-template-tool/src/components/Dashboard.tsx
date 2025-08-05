'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Edit, Delete, Download, Visibility } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Template {
  id: number;
  name: string;
  header_content: string;
  footer_content: string;
  body_content: string;
  created_at: string;
  updated_at: string;
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; template: Template | null }>({
    open: false,
    template: null,
  });
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; template: Template | null }>({
    open: false,
    template: null,
  });

  const loadTemplates = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/templates', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        setMessage({ type: 'error', text: 'Failed to load templates' });
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setMessage({ type: 'error', text: 'Error loading templates' });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleDelete = async (template: Template) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/templates/${template.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== template.id));
        setMessage({ type: 'success', text: 'Template deleted successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete template' });
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      setMessage({ type: 'error', text: 'Error deleting template' });
    }

    setDeleteDialog({ open: false, template: null });
  };

  const handleExport = async (template: Template) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/templates/${template.id}/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${template.name}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage({ type: 'success', text: 'Template exported successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to export template' });
      }
    } catch (error) {
      console.error('Error exporting template:', error);
      setMessage({ type: 'error', text: 'Error exporting template' });
    }
  };

  const generatePreview = (template: Template) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px;">
          ${template.header_content || '<p>No header content</p>'}
        </div>
        <div style="padding: 20px; background-color: white;">
          ${template.body_content || '<p>No body content</p>'}
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          ${template.footer_content || '<p>No footer content</p>'}
        </div>
      </div>
    `;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#dc2626', fontWeight: 'bold' }}>
          Email Templates
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/create-template')}
          sx={{ minWidth: 150 }}
        >
          Create New Template
        </Button>
      </Box>

      {templates.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Get started by creating your first email template
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/create-template')}
          >
            Create Your First Template
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#dc2626' }}>
                    {template.name}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`Created: ${formatDate(template.created_at)}`} 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    {template.updated_at !== template.created_at && (
                      <Chip 
                        label={`Updated: ${formatDate(template.updated_at)}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Header: {template.header_content ? 'Yes' : 'Empty'} | 
                    Body: {template.body_content ? 'Yes' : 'Empty'} | 
                    Footer: {template.footer_content ? 'Yes' : 'Empty'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => setPreviewDialog({ open: true, template })}
                      sx={{ 
                        color: '#dc2626',
                        '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.04)' }
                      }}
                    >
                      Preview
                    </Button>
                  </Box>
                  
                  <Box>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => router.push(`/edit-template/${template.id}`)}
                      sx={{ 
                        color: '#dc2626',
                        '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.04)' }
                      }}
                    >
                      Edit
                    </Button>
                    
                    <Button
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleExport(template)}
                      sx={{ 
                        color: '#dc2626',
                        '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.04)' }
                      }}
                    >
                      Export
                    </Button>
                    
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialog({ open: true, template })}
                      sx={{ 
                        color: '#dc2626',
                        '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.04)' }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, template: null })}
      >
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.template?.name}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, template: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteDialog.template && handleDelete(deleteDialog.template)}
            variant="contained"
            sx={{ backgroundColor: '#dc2626' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, template: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Template Preview: {previewDialog.template?.name}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '70vh',
            }}
          >
            {previewDialog.template && (
              <div dangerouslySetInnerHTML={{ __html: generatePreview(previewDialog.template) }} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, template: null })}>
            Close
          </Button>
          {previewDialog.template && (
            <Button
              variant="contained"
              onClick={() => handleExport(previewDialog.template!)}
            >
              Export HTML
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;