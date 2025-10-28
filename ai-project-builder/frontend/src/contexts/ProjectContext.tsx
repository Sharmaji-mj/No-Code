


// frontend/src/contexts/ProjectContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { projectAPI as projectApi, mejuvanteApi } from '../services/api';
import type { ChatResponse as ApiChatResponse } from '../services/api';

// --- Type Definitions ---
export interface File {
  path: string;
  name: string;
  content: string;
  language: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: 'mejuvante' | 'git' | 'upload' | 'chat';
  status: 'active' | 'completed' | 'archived';
  files?: File[];
  chatHistory?: ChatMessage[];
  deploymentInfo?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

// Deployment response (mock-compatible)
export interface DeploymentResponse {
  success: boolean;
  url: string;
  message: string;
}

// --- Context Type ---
interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  project: Project | null;
  loading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  getProjects: () => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  setCurrentProject: (project: Project | null) => void;
  cloneRepository: (repoUrl: string, projectName: string) => Promise<Project>;

  getFileContent: (projectId: string, filePath: string) => Promise<string | null>;
  updateFileContent: (projectId: string, filePath: string, content: string) => Promise<void>;
  addFile: (projectId: string, file: File) => Promise<void>;
  deleteFile: (projectId: string, filePath: string) => Promise<void>;

  addChatMessage: (projectId: string, message: ChatMessage) => Promise<void>;
  getChatHistory: (projectId: string) => Promise<ChatMessage[]>;

  generateProjectFromChat: (message: string, chatId: string) => Promise<Project>;
  getDeploymentOptions: (applicationType: string) => Promise<any[]>;
  deployProject: (projectId: string, deploymentConfig: any) => Promise<DeploymentResponse>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const detectLanguage = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      html: 'html',
      css: 'css',
      json: 'json',
      py: 'python',
      java: 'java',
      go: 'go',
      md: 'markdown',
    };
    return langMap[ext || ''] || 'plaintext';
  };

  // Normalize incoming API files to our File type
  const normalizeApiFiles = (apiFiles: any[]): File[] =>
    (apiFiles || []).map((f: any) => {
      const resolvedPath: string = f?.path ?? f?.name ?? 'index.html';
      const resolvedName: string =
        f?.name ?? (typeof resolvedPath === 'string' ? resolvedPath.split('/').pop() || resolvedPath : 'file');
      return {
        path: resolvedPath,
        name: resolvedName,
        content: f?.content ?? f?.code ?? '',
        language: f?.language ?? detectLanguage(resolvedPath),
      };
    });

  const formatProject = (data: any): Project => {
    return {
      id: data.id || data._id || `project_${Date.now()}`,
      name: data.name || 'Untitled Project',
      description: data.description || '',
      type: data.type || 'mejuvante',
      status: data.status || 'active',
      files: Array.isArray(data.files) ? normalizeApiFiles(data.files) : [],
      chatHistory: Array.isArray(data.chatHistory)
        ? data.chatHistory.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }))
        : [],
      deploymentInfo: data.deploymentInfo || null,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectApi.getAll();
      let projectsData: any[] = [];
      if (Array.isArray(response)) projectsData = response;
      else if (response.data && Array.isArray(response.data)) projectsData = response.data;
      else if (response.projects && Array.isArray(response.projects)) projectsData = response.projects;
      setProjects(projectsData.map(formatProject));
    } catch (err: any) {
      console.error('❌ Error fetching projects:', err);
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: Partial<Project>): Promise<Project> => {
    try {
      setLoading(true);
      setError(null);
      let filesData: any = projectData.files || [];
      if (!Array.isArray(filesData) && typeof filesData === 'object') {
        filesData = Object.entries(filesData as any).map(([path, content]) => ({
          path,
          content: content as string,
          name: path.split('/').pop() || path,
          language: detectLanguage(path),
        }));
      }
      const payload = {
        name: projectData.name || 'Untitled Project',
        description: projectData.description || '',
        type: projectData.type || 'mejuvante',
        status: projectData.status || 'active',
        files: filesData,
        chatHistory: projectData.chatHistory || [],
      };
      const response = await projectApi.create(payload);
      const formatted = formatProject(response);
      setProjects((prev) => [formatted, ...prev]);
      return formatted;
    } catch (err: any) {
      console.error('❌ Error creating project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(
    async (id: string, updates: Partial<Project>): Promise<Project> => {
      try {
        setLoading(true);
        setError(null);
        let filesData = updates.files as any;
        if (filesData && !Array.isArray(filesData)) {
          filesData = Object.entries(filesData as any).map(([path, content]) => ({
            path,
            content: content as string,
            name: path.split('/').pop() || path,
            language: detectLanguage(path),
          }));
        }
        const payload: any = { ...updates };
        if (filesData) payload.files = filesData;
        const response = await projectApi.update(id, payload);
        const formatted = formatProject(response);
        setProjects((prev) => prev.map((p) => (p.id === id ? formatted : p)));
        if (currentProject?.id === id) setCurrentProject(formatted);
        return formatted;
      } catch (err: any) {
        console.error('❌ Error updating project:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update project';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [currentProject]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        await projectApi.delete(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (currentProject?.id === id) setCurrentProject(null);
      } catch (err: any) {
        console.error('❌ Error deleting project:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete project';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [currentProject]
  );

  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectApi.getById(id);
      const formatted = formatProject(response);
      setProjects((prev) => {
        const index = prev.findIndex((p) => p.id === id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = formatted;
          return updated;
        }
        return [formatted, ...prev];
      });
      return formatted;
    } catch (err: any) {
      console.error('❌ Error fetching project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch project';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileContent = useCallback(
    async (projectId: string, filePath: string): Promise<string | null> => {
      try {
        const project = await getProject(projectId);
        if (!project || !project.files) return null;
        const file = project.files.find((f) => f.path === filePath);
        return file?.content || null;
      } catch (err: any) {
        console.error('Error getting file content:', err);
        return null;
      }
    },
    [getProject]
  );

  const updateFileContent = useCallback(
    async (projectId: string, filePath: string, content: string): Promise<void> => {
      try {
        const project = projects.find((p) => p.id === projectId);
        if (!project || !project.files) return;
        const updatedFiles = project.files.map((f) => (f.path === filePath ? { ...f, content } : f));
        await updateProject(projectId, { files: updatedFiles });
      } catch (err: any) {
        console.error('Error updating file content:', err);
        throw err;
      }
    },
    [projects, updateProject]
  );

  const addFile = useCallback(
    async (projectId: string, file: File): Promise<void> => {
      try {
        const project = projects.find((p) => p.id === projectId);
        if (!project) return;
        const updatedFiles = [...(project.files || []), file];
        await updateProject(projectId, { files: updatedFiles });
      } catch (err: any) {
        console.error('Error adding file:', err);
        throw err;
      }
    },
    [projects, updateProject]
  );

  const deleteFile = useCallback(
    async (projectId: string, filePath: string): Promise<void> => {
      try {
        const project = projects.find((p) => p.id === projectId);
        if (!project || !project.files) return;
        const updatedFiles = project.files.filter((f) => f.path !== filePath);
        await updateProject(projectId, { files: updatedFiles });
      } catch (err: any) {
        console.error('Error deleting file:', err);
        throw err;
      }
    },
    [projects, updateProject]
  );

  const addChatMessage = useCallback(
    async (projectId: string, message: ChatMessage): Promise<void> => {
      try {
        const project = projects.find((p) => p.id === projectId);
        if (!project) return;
        const updatedHistory = [...(project.chatHistory || []), message];
        await updateProject(projectId, { chatHistory: updatedHistory });
      } catch (err: any) {
        console.error('Error adding chat message:', err);
        throw err;
      }
    },
    [projects, updateProject]
  );

  const getChatHistory = useCallback(
    async (projectId: string): Promise<ChatMessage[]> => {
      try {
        const project = await getProject(projectId);
        return project?.chatHistory || [];
      } catch (err: any) {
        console.error('Error getting chat history:', err);
        return [];
      }
    },
    [getProject]
  );

  const cloneRepository = useCallback(
    async (repoUrl: string, projectName: string): Promise<Project> => {
      try {
        setLoading(true);
        setError(null);
        const project = await createProject({
          name: projectName || 'Git Repository',
          description: `Cloned from ${repoUrl}`,
          type: 'git',
          status: 'active',
          files: [],
          chatHistory: [],
        });
        return project;
      } catch (err: any) {
        console.error('❌ Error cloning repository:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to clone repository';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [createProject]
  );

  const generateProjectFromChat = useCallback(
    async (message: string, chatId: string): Promise<Project> => {
      try {
        setLoading(true);
        setError(null);

        const apiResp: ApiChatResponse = await mejuvanteApi.chat({
          message,
          projectId: chatId,
          conversationHistory: [],
        });

        const normalizedFiles = normalizeApiFiles(apiResp.files || []);

        if (normalizedFiles.length > 0) {
          const projectName = extractProjectNameFromMessage(message) || 'Generated Project';
          const project = await createProject({
            name: projectName,
            description: message,
            type: 'mejuvante',
            status: 'active',
            files: normalizedFiles,
            chatHistory: [
              { role: 'user', content: message, timestamp: new Date() },
              { role: 'assistant', content: apiResp.reply || apiResp.message, timestamp: new Date() },
            ],
          });
          setCurrentProject(project);
          return project;
        } else {
          throw new Error('No files were generated');
        }
      } catch (err: any) {
        console.error('Error generating project from chat:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to generate project';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [createProject]
  );

  const getDeploymentOptions = useCallback(async (applicationType: string = 'web'): Promise<any[]> => {
    try {
      const options = await mejuvanteApi.getDeploymentOptions(applicationType);
      return Array.isArray(options) ? options : [options];
    } catch (err: any) {
      console.error('Error getting deployment options:', err);
      return [
        {
          id: 's3-static',
          name: 'S3 Static Website',
          description: 'Deploy frontend as static website',
          price: '~$5/month',
          icon: '☁️',
          instanceTypes: [],
        },
        {
          id: 'ec2',
          name: 'EC2 Instance',
          description: 'Deploy on virtual server',
          price: '~$10/month',
          icon: '🖥️',
          instanceTypes: [{ id: 't2.micro', name: 'Micro', hourlyRate: 0.0116, memory: '1GB', cpu: '1', storage: '8GB' }],
        },
      ];
    }
  }, []);

  const deployProject = useCallback(
    async (projectId: string, deploymentConfig: any): Promise<DeploymentResponse> => {
      try {
        setLoading(true);
        setError(null);
        const project = projects.find((p) => p.id === projectId);
        if (!project) throw new Error('Project not found');

        const response: DeploymentResponse = await mejuvanteApi.deployToAWS({
          files: project.files || [],
          projectName: project.name,
          deploymentType: deploymentConfig.deploymentType,
          awsConfig: deploymentConfig.awsConfig,
        });

        await updateProject(projectId, { deploymentInfo: response });
        return response;
      } catch (err: any) {
        console.error('Error deploying project:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to deploy project';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [projects, updateProject]
  );

  const extractProjectNameFromMessage = (message: string): string | null => {
    const match = message.match(
      /(?:create|build|generate|make|develop)\s+(?:a|an)?\s*([a-zA-Z0-9\s]+?)(?:\s+(?:app|website|project|application))/i
    );
    return match ? match[1].trim() : null;
  };

  const getProjects = useCallback(async () => fetchProjects(), [fetchProjects]);

  const value: ProjectContextType = {
    projects,
    currentProject,
    project: currentProject,
    loading,
    error,
    fetchProjects,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    setCurrentProject,
    cloneRepository,
    getFileContent,
    updateFileContent,
    addFile,
    deleteFile,
    addChatMessage,
    getChatHistory,
    generateProjectFromChat,
    getDeploymentOptions,
    deployProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export default ProjectProvider;
