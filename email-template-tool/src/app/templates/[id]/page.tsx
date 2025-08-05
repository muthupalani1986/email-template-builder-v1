'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TemplateEditor from '@/components/TemplateEditor';
import { useAuth } from '@/contexts/AuthContext';

interface Template {
  id: number;
  name: string;
  header_content: string;
  footer_content: string;
  body_content: string;
  created_at: string;
  updated_at: string;
}

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchTemplate();
  }, [user, router]);

  const fetchTemplate = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/templates/${id}`);
      if (response.ok) {
        const templateData = await response.json();
        setTemplate(templateData);
      } else if (response.status === 404) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch template:', error);
      router.push('/');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSave = async (templateData: {
    name: string;
    header_content: string;
    footer_content: string;
    body_content: string;
  }) => {
    setLoading(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const updatedTemplate = await response.json();
        setTemplate(updatedTemplate);
        alert('Template saved successfully!');
      } else {
        alert('Failed to save template');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-gray-600">Loading template...</div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-gray-600">Template not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Template</h1>
          <p className="text-gray-600">Modify your email template</p>
        </div>
        
        <TemplateEditor template={template} onSave={handleSave} loading={loading} />
      </main>
    </div>
  );
}