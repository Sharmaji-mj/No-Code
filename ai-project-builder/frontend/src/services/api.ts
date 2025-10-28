// frontend/src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

/* ------------------------------------------------------------------ */
/* Base URL                                                            */
/* ------------------------------------------------------------------ */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
// Optional debug:
console.log('[api] baseURL =', API_URL);

/* ------------------------------------------------------------------ */
/* Axios client                                                        */
/* ------------------------------------------------------------------ */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60s for long AI ops
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ChatMessage {
  message: string;
  projectId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userPreferences?: any;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  message: string;
  files?: Array<{
    name?: string;
    path?: string;
    content: string;
    language?: string;
  }>;
  stackRecommendation?: any;
  setupInstructions?: string[];
  dependencies?: any;
  features?: string[];
  apiEndpoints?: any[];
  nextSteps?: string[];
  projectId?: string;
  metadata?: any;
}

export interface TerminalCommand {
  projectId?: string;
  command: string;
}
export interface TerminalResponse {
  output: string;
  exitCode: number;
  executionTime: number;
}
export interface ExportZipRequest {
  files: Array<{ name?: string; path?: string; content: string; language?: string }>;
  projectName: string;
}

/* ---- validation (for /mejuvante/validate) ---- */
export interface ValidationIssue {
  file: string;
  line?: number;
  severity: 'low' | 'medium' | 'high';
  message: string;
  fix?: string;
}
export interface ValidationResponse {
  success: boolean;
  summary: string;
  issues: ValidationIssue[];
  fixedFiles?: Array<{ name: string; path: string; content: string; language?: string }>;
  model?: string;
  tokensUsed?: number;
}

/* ------------------------------------------------------------------ */
/* Chat / Mejuvante core                                               */
/* ------------------------------------------------------------------ */
export const chatAPI = {
  sendMessage: async (data: ChatMessage): Promise<ChatResponse> => {
    const { data: resp } = await apiClient.post('/mejuvante/chat', data);
    return resp;
  },
  chat: async (data: ChatMessage): Promise<ChatResponse> => {
    const { data: resp } = await apiClient.post('/mejuvante/chat', data);
    return resp;
  },
  executeCommand: async (data: TerminalCommand): Promise<TerminalResponse> => {
    const { data: resp } = await apiClient.post('/mejuvante/terminal/execute', data);
    return resp;
  },
  exportZip: async (data: ExportZipRequest): Promise<Blob> => {
    const resp = await apiClient.post('/mejuvante/export-zip', data, { responseType: 'blob' });
    return resp.data;
  },
  createPreview: async (projectId: string, files: any[]) => {
    const { data: resp } = await apiClient.post('/mejuvante/preview', { projectId, files });
    return resp;
  },
  getPreviewUrl: (projectId: string) => `${API_URL}/mejuvante/preview/${projectId}`,
  healthCheck: async () => (await apiClient.get('/mejuvante/health')).data,
};

/* ------------------------------------------------------------------ */
/* Auth API                                                            */
/* ------------------------------------------------------------------ */
export const authAPI = {
  // your backend expects { name, email, password } on register
  register: async (data: { name: string; email: string; password: string }) => {
    const { data: resp } = await apiClient.post('/auth/register', data);
    if (resp.token) localStorage.setItem('token', resp.token);
    return resp;
  },
  login: async (data: { email: string; password: string }) => {
    const { data: resp } = await apiClient.post('/auth/login', data);
    if (resp.token) localStorage.setItem('token', resp.token);
    return resp;
  },
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  getCurrentUser: async () => (await apiClient.get('/auth/me')).data,
  updateProfile: async (data: { username?: string; avatar?: string }) =>
    (await apiClient.put('/auth/profile', data)).data,
  changePassword: async (data: { currentPassword: string; newPassword: string }) =>
    (await apiClient.put('/auth/change-password', data)).data,
};
// export const getChatHistory = async (token: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/chat/history`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching chat history:", error);
//     throw error;
//   }
// };
/* ------------------------------------------------------------------ */
/* Get Chat History for Logged-in User                                */
/* ------------------------------------------------------------------ */
export const getChatHistory = async (token: string) => {
  try {
    // const response = await apiClient.get("/api/chat/history", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // return response.data; // backend should return an array of chats
  const response = await apiClient.get("/chat/history", {
  headers: { Authorization: `Bearer ${token}` },
});

  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const chatHistoryAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/chat/history');
    return data;
  },
  save: async (chat: any) => {
    const { data } = await apiClient.post('/chat/history', chat);
    return data;
  },
  delete: async (chatId: string) => {
    const { data } = await apiClient.delete(`/chat/history/${chatId}`);
    return data;
  },
};

/* ------------------------------------------------------------------ */
/* Projects API                                                        */
/* ------------------------------------------------------------------ */
export const projectAPI = {
  getProjects: async () => (await apiClient.get('/projects')).data,
  getAll: async () => (await apiClient.get('/projects')).data,
  getProject: async (projectId: string) => (await apiClient.get(`/projects/${projectId}`)).data,
  getById: async (projectId: string) => (await apiClient.get(`/projects/${projectId}`)).data,
  createProject: async (data: any) => (await apiClient.post('/projects', data)).data,
  create: async (data: any) => (await apiClient.post('/projects', data)).data,
  updateProject: async (projectId: string, data: any) => (await apiClient.put(`/projects/${projectId}`, data)).data,
  update: async (projectId: string, data: any) => (await apiClient.put(`/projects/${projectId}`, data)).data,
  deleteProject: async (projectId: string) => (await apiClient.delete(`/projects/${projectId}`)).data,
  delete: async (projectId: string) => (await apiClient.delete(`/projects/${projectId}`)).data,
};
export async function downloadZip(
  projectName: string,
  files: Array<{ name?: string; path?: string; content: string; language?: string }>
) {
  const blob = await apiClient.post('/mejuvante/export-zip', { files, projectName }, { responseType: 'blob' })
    .then(r => r.data);

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(projectName || 'project').replace(/\s+/g, '-')}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
/* ------------------------------------------------------------------ */
/* Mejuvante convenience wrapper                                       */
/* ------------------------------------------------------------------ */
export const mejuvanteApi = {
  ...chatAPI,
// saveChat: async (data: any) => {
//   try {
//     const res = await apiClient.post("/mejuvante/save-chat", data);
//     return res.data;
//   } catch (err) {
//     console.error("Failed to save chat", err);
//     throw err;
//   }
// },
saveChat: async (data: any) => {
  try {
    const res = await apiClient.post("/chat/history", data);
    return res.data;
  } catch (err) {
    console.error("Failed to save chat", err);
    throw err;
  }
},

  generateProject: async (prompt: string, options?: any) =>
    (await apiClient.post('/mejuvante/chat', { message: prompt, ...options })).data,

  modifyProject: async (projectId: string, modification: string) =>
    (await apiClient.post('/mejuvante/chat', { message: modification, projectId })).data,

  // Code validation (server: POST /api/mejuvante/validate)
  validate: async (
    files: Array<{ name?: string; path?: string; content: string; language?: string }>
  ): Promise<ValidationResponse> => {
    const { data } = await apiClient.post('/mejuvante/validate', { files });
    return data;
  },
 getDeployPlan: async (projectId: string) =>
    (await apiClient.post('/mejuvante/deploy/plan', { projectId })).data,

  deployToBackend: async (payload: { projectId: string; files?: any[]; config?: any }) => {
    const { data } = await apiClient.post('/mejuvante/deploy', payload);
    return data as { success: boolean; url?: string; message?: string; deployment?: any };
  },
  

  // Simple deployment options for UI (can replace with real endpoint later)
  getDeploymentOptions: async (applicationType: string = 'web') => {
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
        instanceTypes: [
          { id: 't2.micro', name: 'Micro', hourlyRate: 0.0116, memory: '1GB', cpu: '1', storage: '8GB' },
        ],
      },
    ];
  },
// deployToBackend: async (payload: { projectId: string; files?: any[]; config?: any }) => {
//     const { data } = await apiClient.post('/mejuvante/deploy', payload);
//     return data as { success: boolean; url?: string; message?: string };
//   },
// };

// Small helper to download a ZIP using your /export-zip

  // Placeholder deploy (swap to real backend when ready)
  deployToAWS: async (config: any) => {
    // Example when backend is ready:
    // return (await apiClient.post('/mejuvante/deploy', config)).data;
    return { success: true, url: 'https://example-deploy.aws', message: 'Deployment started' };
  },
};

/* ------------------------------------------------------------------ */
export default apiClient;
export { apiClient };
