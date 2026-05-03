export type User = {
  id: string;
  email: string;
  name?: string | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number };
};

export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
};

export type RootStackParamList = {
  Login: undefined;
  VerifyOtp: { email: string; name?: string };
  Projects: undefined;
  CreateProject: undefined;
  ProjectDetail: { projectId: string; title: string };
  CreateTask: { projectId: string };
};
