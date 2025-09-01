export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;                  
  status: 'todo' | 'doing' | 'done'; 
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
