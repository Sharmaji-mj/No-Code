

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectAPI as projectApi } from '../services/api';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ChatInterface from '../components/ChatInterface/ChatInterface';
import { ChatSidebar } from '../components/ChatSidebar/ChatSidebar';

// Types
interface Project {
  id: string;
  name: string;
  description: string;
  files: { [key: string]: string };
  userId: string;
}

interface File {
  name: string;
  content: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock chat history (replace with real API if available)
  const mockChatHistory: ChatHistoryItem[] = [
    { id: '1', title: 'Initial Setup', lastMessage: 'How do I start?', timestamp: '2 hours ago' },
    { id: '2', title: 'Component Help', lastMessage: 'Can you generate a button?', timestamp: '1 hour ago' },
    { id: '3', title: 'Styling Issue', lastMessage: 'The CSS is not applying correctly.', timestamp: '45 mins ago' },
  ];

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        // Use getById instead of non-existent getProject
        const response = await projectApi.getById(projectId);
        setProject(response as unknown as Project);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  // Update files when project changes
  useEffect(() => {
    if (project && project.files) {
      const fileEntries = Object.entries(project.files).map(([name, content]) => ({ name, content }));
      setFiles(fileEntries);
      setSelectedFile(fileEntries[0] || null);
    }
  }, [project]);

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    setActiveTab('code');
  };

  const renderPreview = () => {
    if (!selectedFile) return <div>Select a file to preview.</div>;
    if (!selectedFile.name.endsWith('.html') && !selectedFile.name.endsWith('.jsx')) {
      return <div>Preview is only available for HTML/JSX files.</div>;
    }
    return (
      <iframe
        srcDoc={selectedFile.content}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="preview"
        sandbox="allow-scripts"
      />
    );
  };

  const handleDeploy = () => {
    alert('Deploy feature coming soon!');
  };

  return (
    <div className="project-workspace">
      {/* Sidebar toggle */}
      <button
        className="sidebar-toggle-button"
        onClick={() => setIsSidebarOpen(true)}
        title="Open Chat History"
      >
        ☰
      </button>

      {/* Header */}
      <header className="workspace-header">
        <h2>{project?.name || 'Project Workspace'}</h2>
        <button onClick={handleDeploy} className="deploy-button">
          Deploy
        </button>
      </header>

      <div className="workspace-content">
        {/* File Explorer */}
        <aside className="file-explorer">
          <h3>Files</h3>
          <ul>
            {files.map((file) => (
              <li
                key={file.name}
                className={selectedFile?.name === file.name ? 'active' : ''}
                onClick={() => handleFileClick(file)}
              >
                {file.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Code Editor / Preview */}
        <main className="code-editor">
          <div className="editor-header">
            <button
              className={activeTab === 'code' ? 'active' : ''}
              onClick={() => setActiveTab('code')}
            >
              Code
            </button>
            <button
              className={activeTab === 'preview' ? 'active' : ''}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>
          <div className="editor-content">
            {activeTab === 'code' && selectedFile && (
              <SyntaxHighlighter language="javascript" style={oneDark}>
                {selectedFile.content}
              </SyntaxHighlighter>
            )}
            {activeTab === 'preview' && renderPreview()}
          </div>
        </main>

        {/* Chat Interface */}
        <aside className="workspace-chat">
          <h3>Chat with Mejuvante</h3>
          {/* <ChatInterface projectId={projectId} /> */}
        </aside>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projectName={project?.name || 'Project'}
        projectDescription={project?.description || 'No description'}
        chatHistory={mockChatHistory}
      />
    </div>
  );
};

export default ProjectWorkspace;
