export interface FileStructure {
  name: string;
  content: string;
  type: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  template: string;
  files: FileStructure[];
  created_at: string;
  updated_at: string;
  deployedAt?: string;
}