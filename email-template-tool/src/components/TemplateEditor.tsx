'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface Template {
  id?: number;
  name: string;
  header_content: string;
  footer_content: string;
  body_content: string;
}

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Omit<Template, 'id'>) => Promise<void>;
  loading?: boolean;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

export default function TemplateEditor({ template, onSave, loading = false }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || '');
  const [headerContent, setHeaderContent] = useState(template?.header_content || '');
  const [footerContent, setFooterContent] = useState(template?.footer_content || '');
  const [bodyContent, setBodyContent] = useState(template?.body_content || '');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setHeaderContent(template.header_content);
      setFooterContent(template.footer_content);
      setBodyContent(template.body_content);
    }
  }, [template]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    await onSave({
      name: name.trim(),
      header_content: headerContent,
      footer_content: footerContent,
      body_content: bodyContent,
    });
  };

  const exportAsHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; }
        .email-header { background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #ddd; }
        .email-body { padding: 20px; }
        .email-footer { background-color: #f8f9fa; padding: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">${headerContent}</div>
        <div class="email-body">${bodyContent}</div>
        <div class="email-footer">${footerContent}</div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewHTML = () => `
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; font-family: Arial, sans-serif;">
      <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #ddd;">
        ${headerContent}
      </div>
      <div style="padding: 20px;">
        ${bodyContent}
      </div>
      <div style="background-color: #f8f9fa; padding: 20px; border-top: 1px solid #ddd;">
        ${footerContent}
      </div>
    </div>
  `;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-2">
          Template Name
        </label>
        <input
          id="template-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
          placeholder="Enter template name"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowPreview(false)}
          className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
            !showPreview
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Edit Mode
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
            showPreview
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Preview Mode
        </button>
      </div>

      {showPreview ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
          <div dangerouslySetInnerHTML={{ __html: getPreviewHTML() }} />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Header Section
            </label>
            <ReactQuill
              value={headerContent}
              onChange={setHeaderContent}
              modules={quillModules}
              theme="snow"
              placeholder="Enter header content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Content
            </label>
            <ReactQuill
              value={bodyContent}
              onChange={setBodyContent}
              modules={quillModules}
              theme="snow"
              placeholder="Enter body content..."
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer Section
            </label>
            <ReactQuill
              value={footerContent}
              onChange={setFooterContent}
              modules={quillModules}
              theme="snow"
              placeholder="Enter footer content..."
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Template'}
        </button>
        <button
          onClick={exportAsHTML}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Export as HTML
        </button>
      </div>
    </div>
  );
}