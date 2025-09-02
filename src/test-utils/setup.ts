import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('../services/Firebase', () => ({
  db: { name: 'mock-db' }, 
  auth: {
    currentUser: null,
  },
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ name: 'todos-collection' })),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
}))
