// frontend/src/types/index.ts
export interface File {
  name: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'mejuvante' | 'git' | 'update';
  files: { [key: string]: string };
  status: 'active' | 'completed' | 'fixed';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}