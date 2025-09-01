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
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const todosCollection = collection(db, 'todos');

export const todoService = {
  add: async (title: string, userId: string) => {
    const newTodo = {
      title,
      completed: false,
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
      const todos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Todo[];
      callback(todos);
    });
  },

  update: async (id: string, updates: Partial<Pick<Todo, 'title' | 'completed'>>) => {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  delete: async (id: string) => {
    const todoRef = doc(db, 'todos', id);
    await deleteDoc(todoRef);
  }
};
