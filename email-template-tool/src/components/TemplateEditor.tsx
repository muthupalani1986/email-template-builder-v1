'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '@/contexts/AuthContext';

interface Template {
  id?: number;
  name: string;
  header_content: string;
  footer_content: string;
  body_content: string;
}

interface TemplateEditorProps {
  templateId?: string;
  onSave?: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ templateId, onSave }) => {
  const { token } = useAuth();
  const [template, setTemplate] = useState<Template>({
    name: '',
    header_content: '',
    footer_content: '',
    body_content: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadTemplate = useCallback(async () => {
    if (!token || !templateId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      } else {
        setMessage({ type: 'error', text: 'Failed to load template' });
      }
    } catch (error) {
      console.error('Error loading template:', error);
      setMessage({ type: 'error', text: 'Error loading template' });
    } finally {
      setIsLoading(false);
    }
  }, [token, templateId]);

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId, loadTemplate]);

  const handleSave = async () => {
    if (!token) return;

    if (!template.name.trim()) {
      setMessage({ type: 'error', text: 'Template name is required' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const url = templateId 
        ? `http://localhost:3001/api/templates/${templateId}`
        : 'http://localhost:3001/api/templates';
      
      const method = templateId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        const savedTemplate = await response.json();
        setTemplate(savedTemplate);
        setMessage({ type: 'success', text: 'Template saved successfully!' });
        if (onSave) onSave();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save template' });
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setMessage({ type: 'error', text: 'Error saving template' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!token || !templateId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/templates/${templateId}/export`, {
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

  const generatePreview = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px;">
          ${template.header_content || '<p>Header content will appear here</p>'}
        </div>
        <div style="padding: 20px; background-color: white;">
          ${template.body_content || '<p>Body content will appear here</p>'}
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          ${template.footer_content || '<p>Footer content will appear here</p>'}
        </div>
      </div>
    `;
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

      <Grid container spacing={3}>
        {/* Editor Panel */}
        <Grid item xs={12} md={showPreview ? 6 : 12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#dc2626', fontWeight: 'bold' }}>
              {templateId ? 'Edit Template' : 'Create New Template'}
            </Typography>

            <TextField
              fullWidth
              label="Template Name"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              margin="normal"
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Header Section
            </Typography>
            <Editor
              apiKey="no-api-key" // You'll need to get a free API key from TinyMCE
              value={template.header_content}
              onEditorChange={(content) => setTemplate({ ...template, header_content: content })}
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Body Content
            </Typography>
            <Editor
              apiKey="no-api-key"
              value={template.body_content}
              onEditorChange={(content) => setTemplate({ ...template, body_content: content })}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Footer Section
            </Typography>
            <Editor
              apiKey="no-api-key"
              value={template.footer_content}
              onEditorChange={(content) => setTemplate({ ...template, footer_content: content })}
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              }}
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                sx={{ minWidth: 120 }}
              >
                {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save Template'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => setShowPreview(!showPreview)}
                sx={{ 
                  color: '#dc2626', 
                  borderColor: '#dc2626',
                  '&:hover': {
                    borderColor: '#b91c1c',
                    backgroundColor: 'rgba(220, 38, 38, 0.04)',
                  }
                }}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>

              {templateId && (
                <Button
                  variant="outlined"
                  onClick={handleExport}
                  sx={{ 
                    color: '#dc2626', 
                    borderColor: '#dc2626',
                    '&:hover': {
                      borderColor: '#b91c1c',
                      backgroundColor: 'rgba(220, 38, 38, 0.04)',
                    }
                  }}
                >
                  Export HTML
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Preview Panel */}
        {showPreview && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#dc2626', fontWeight: 'bold' }}>
                Live Preview
              </Typography>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: '70vh',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: generatePreview() }} />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default TemplateEditor;