

// src/pages/Editor.tsx - Complete fixes for type mismatches

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useProject, File } from '../contexts/ProjectContext';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import MejuvanteOne from '../components/MejuvanteOne/MejuvanteOne';

const Editor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  
  // Use currentProject instead of project
  const { currentProject, loading, updateProject, getFileContent } = useProject();
  
  const [activeTab, setActiveTab] = useState('editor');
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [activeFile, setActiveFile] = useState('index.html');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  // Helper: Detect language from file path
  const detectLanguage = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'py': 'python',
      'java': 'java',
      'go': 'go',
    };
    return langMap[ext || ''] || 'plaintext';
  };

  // Helper: Convert File[] array to object format
  const filesToObject = (fileArray: File[]): { [key: string]: string } => {
    const fileObj: { [key: string]: string } = {};
    fileArray.forEach(file => {
      fileObj[file.path] = file.content;
    });
    return fileObj;
  };

  // Helper: Convert object to File[] array
  const objectToFiles = (fileObj: { [key: string]: string }): File[] => {
    return Object.entries(fileObj).map(([path, content]) => ({
      path,
      content,
      name: path.split('/').pop() || path,
      language: detectLanguage(path)
    }));
  };

  // Load project files when project changes
  useEffect(() => {
    if (currentProject && currentProject.files) {
      // Convert File[] array to object for local state
      const filesObject = filesToObject(currentProject.files);
      setFiles(filesObject);
      
      const fileNames = Object.keys(filesObject);
      if (fileNames.length > 0 && !fileNames.includes(activeFile)) {
        setActiveFile(fileNames[0]);
      }
    }
  }, [currentProject]);

  // Load active file content
  useEffect(() => {
    if (projectId && activeFile) {
      getFileContent(projectId, activeFile)
        .then((content: string | null) => {
          if (content) {
            setCode(content);
            setLanguage(detectLanguage(activeFile));
          }
        })
        .catch((error: any) => console.error('Error loading file:', error));
    }
  }, [projectId, activeFile, getFileContent]);

  // Update code when active file changes
  useEffect(() => {
    if (files[activeFile]) {
      setCode(files[activeFile]);
      setLanguage(detectLanguage(activeFile));
    }
  }, [activeFile, files]);

  // Handle save
  const handleSave = async () => {
    if (projectId) {
      // Update current file in local state
      const updatedFiles = { ...files, [activeFile]: code };
      setFiles(updatedFiles);
      
      // Convert object to File[] array for API
      const filesArray = objectToFiles(updatedFiles);
      
      // Save to backend
      await updateProject(projectId, { files: filesArray });
      
      console.log('✅ Files saved successfully');
    }
  };

  // Handle code change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setFiles(prev => ({
      ...prev,
      [activeFile]: newCode
    }));
  };

  // Handle file selection
  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath);
  };

  // Handle file upload
  const handleFileUpload = (uploadedFiles: File[]) => {
    const filesObject = filesToObject(uploadedFiles);
    setFiles(prev => ({ ...prev, ...filesObject }));
  };

  // Render
  const projectName = currentProject?.name || 'Loading...';
  const fileList = Object.keys(files);

  if (loading) {
    return <div className="editor-loading">Loading project...</div>;
  }

  if (!currentProject) {
    return <div className="editor-error">Project not found</div>;
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <h1>{projectName}</h1>
        <button onClick={handleSave} className="btn-save">
          💾 Save
        </button>
      </div>

      <div className="editor-tabs">
        <button
          className={activeTab === 'editor' ? 'active' : ''}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button
          className={activeTab === 'ai' ? 'active' : ''}
          onClick={() => setActiveTab('ai')}
        >
          AI Assistant
        </button>
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          Upload Files
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'editor' && (
          <div className="editor-main">
            <div className="file-sidebar">
              <h3>Files</h3>
              {fileList.map(filePath => (
                <div
                  key={filePath}
                  className={`file-item ${activeFile === filePath ? 'active' : ''}`}
                  onClick={() => handleFileSelect(filePath)}
                >
                  📄 {filePath.split('/').pop()}
                </div>
              ))}
            </div>
            
            <div className="code-editor-area">
              <CodeEditor
                code={code}
                language={language}
                onChange={handleCodeChange}
              />
            </div>
          </div>
        )}

        
// REPLACE WITH:
{activeTab === 'ai' && projectId && (
  <MejuvanteOne 
    projectId={projectId}
    onClose={() => setActiveTab('editor')}
    currentCode={code}
    language={language}
    onCodeGenerated={(newCode: string) => {
      setCode(newCode);
      handleCodeChange(newCode);
    }}
  />
)}
      </div>
    </div>
  );
};

export default Editor;