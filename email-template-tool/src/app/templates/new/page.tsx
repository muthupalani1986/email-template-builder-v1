'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TemplateEditor from '@/components/TemplateEditor';
import { useAuth } from '@/contexts/AuthContext';

export default function NewTemplatePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSave = async (templateData: {
    name: string;
    header_content: string;
    footer_content: string;
    body_content: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        router.push(`/templates/${newTemplate.id}`);
      } else {
        alert('Failed to create template');
      }
    } catch (error) {
      console.error('Failed to create template:', error);
      alert('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Template</h1>
          <p className="text-gray-600">Build your email template with header, body, and footer sections</p>
        </div>
        
        <TemplateEditor onSave={handleSave} loading={loading} />
      </main>
    </div>
  );
}