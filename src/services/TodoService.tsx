import { db } from './Firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';

export interface Todo {
  id: string;
  title: string;
  description?: string;                    
  status: 'todo' | 'doing' | 'done';  
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const todosCollection = collection(db, 'todos');

export const todoService = {
  add: async (title: string, description: string, userId: string) => {
    const newTodo = {
      title,
      description,
      status: 'todo' as const,              
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await addDoc(todosCollection, newTodo);
  },

  subscribe: (userId: string, callback: (todos: Todo[]) => void) => {
    const q = query(
      todosCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const todos = snapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.title,
          description: data.description || '',          
          status: data.status || (data.completed ? 'done' : 'todo'), 
          userId: data.userId,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
      }) as Todo[];
      callback(todos);
    });
  },

  update: async (id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status'>>) => {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  updateContent: async (id: string, updates: Partial<Pick<Todo, 'title' | 'description'>>) => {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  updateStatus: async (id: string, newStatus: 'todo' | 'doing' | 'done') => {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, {
      status: newStatus
      // Não atualiza updatedAt para mudanças de status
    });
  },

  delete: async (id: string) => {
    const todoRef = doc(db, 'todos', id);
    await deleteDoc(todoRef);
  },

  moveToStatus: async (id: string, newStatus: 'todo' | 'doing' | 'done') => {
    await todoService.updateStatus(id, newStatus);
  }
};
