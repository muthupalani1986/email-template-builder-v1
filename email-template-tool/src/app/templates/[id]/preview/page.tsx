'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
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

export default function PreviewTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }
  };

  const exportAsHTML = () => {
    if (!template) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #ddd; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .email-header { background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #ddd; }
        .email-body { padding: 20px; }
        .email-footer { background-color: #f8f9fa; padding: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">${template.header_content}</div>
        <div class="email-body">${template.body_content}</div>
        <div class="email-footer">${template.footer_content}</div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  if (loading) {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Preview: {template.name}</h1>
            <p className="text-gray-600">Live preview of your email template</p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/templates/${template.id}`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Edit Template
            </Link>
            <button
              onClick={exportAsHTML}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Export as HTML
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-6 text-center">Email Preview</h3>
            
            <div
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderBottom: '1px solid #ddd',
                }}
                dangerouslySetInnerHTML={{ __html: template.header_content }}
              />
              
              {/* Body */}
              <div
                style={{ padding: '20px' }}
                dangerouslySetInnerHTML={{ __html: template.body_content }}
              />
              
              {/* Footer */}
              <div
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderTop: '1px solid #ddd',
                }}
                dangerouslySetInnerHTML={{ __html: template.footer_content }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Templates
          </Link>
        </div>
      </main>
    </div>
  );
}