import { describe, it, expect, vi, beforeEach } from 'vitest'
import { todoService } from '../TodoService'
import { 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore'

vi.mock('firebase/firestore')
vi.mock('../Firebase', () => ({
  db: {}
}))

describe('TodoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('add', () => {
    it('deve adicionar uma nova tarefa com dados corretos', async () => {
      const mockDocRef = { id: 'mock-id' }
      vi.mocked(addDoc).mockResolvedValue(mockDocRef as any)
      
      const titulo = 'Minha nova tarefa'
      const descricao = 'Descrição da tarefa'
      const userId = 'user-123'

      const result = await todoService.add(titulo, descricao, userId)

      expect(addDoc).toHaveBeenCalledTimes(1)
      
      const [, todoData] = vi.mocked(addDoc).mock.calls[0]
      expect(todoData).toEqual({
        title: titulo,
        description: descricao,
        status: 'todo',
        userId: userId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
      
      expect(result).toBe(mockDocRef)
    })

    it('deve criar tarefa com status inicial "todo"', async () => {
      vi.mocked(addDoc).mockResolvedValue({ id: 'test' } as any)

      await todoService.add('Título', 'Descrição', 'user-123')

      const [, todoData] = vi.mocked(addDoc).mock.calls[0]
      expect((todoData as any).status).toBe('todo')
    })
  })

  describe('update', () => {
    it('deve atualizar uma tarefa com novos dados', async () => {
      const mockDocRef = { id: 'task-123' }
      vi.mocked(doc).mockReturnValue(mockDocRef as any)
      vi.mocked(updateDoc).mockResolvedValue(undefined)

      const taskId = 'task-123'
      const updates = { title: 'Título atualizado', status: 'doing' as const }

      await todoService.update(taskId, updates)

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'todos', taskId)
      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          ...updates,
          updatedAt: expect.any(Date)
        })
      )
    })
  })

  describe('updateContent', () => {
    it('deve atualizar apenas título e descrição', async () => {
      const mockDocRef = { id: 'task-123' }
      vi.mocked(doc).mockReturnValue(mockDocRef as any)
      vi.mocked(updateDoc).mockResolvedValue(undefined)

      const taskId = 'task-123'
      const updates = { title: 'Novo título', description: 'Nova descrição' }

      await todoService.updateContent(taskId, updates)

      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          title: 'Novo título',
          description: 'Nova descrição',
          updatedAt: expect.any(Date)
        })
      )
    })
  })

  describe('updateStatus', () => {
    it('deve atualizar apenas o status da tarefa', async () => {
      const mockDocRef = { id: 'task-123' }
      vi.mocked(doc).mockReturnValue(mockDocRef as any)
      vi.mocked(updateDoc).mockResolvedValue(undefined)

      const taskId = 'task-123'
      const novoStatus = 'done'

      await todoService.updateStatus(taskId, novoStatus)

      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        { status: novoStatus }
      )
    })

    it('deve aceitar todos os status válidos', async () => {
      const mockDocRef = { id: 'task-123' }
      vi.mocked(doc).mockReturnValue(mockDocRef as any)
      vi.mocked(updateDoc).mockResolvedValue(undefined)

      const taskId = 'task-123'
      const statusValidos: Array<'todo' | 'doing' | 'done'> = ['todo', 'doing', 'done']

      for (const status of statusValidos) {
        await todoService.updateStatus(taskId, status)
        expect(updateDoc).toHaveBeenCalledWith(
          mockDocRef,
          { status }
        )
      }

      expect(updateDoc).toHaveBeenCalledTimes(3)
    })
  })

  describe('delete', () => {
    it('deve deletar uma tarefa pelo ID', async () => {
      const mockDocRef = { id: 'task-123' }
      vi.mocked(doc).mockReturnValue(mockDocRef as any)
      vi.mocked(deleteDoc).mockResolvedValue(undefined)

      const taskId = 'task-123'

      await todoService.delete(taskId)

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'todos', taskId)
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef)
    })
  })

  describe('moveToStatus', () => {
    it('deve mover tarefa para novo status', async () => {
      const mockDocRef = { id: 'task-123' }
      vi.mocked(doc).mockReturnValue(mockDocRef as any)
      vi.mocked(updateDoc).mockResolvedValue(undefined)

      const taskId = 'task-123'
      const novoStatus = 'done'

      await todoService.moveToStatus(taskId, novoStatus)

      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        { status: novoStatus }
      )
    })
  })

  describe('subscribe', () => {
    it('deve configurar listener para tarefas do usuário', () => {
      const userId = 'user-123'
      const callback = vi.fn()
      const mockQuery = { id: 'mock-query' }
      const mockUnsubscribe = vi.fn()

      vi.mocked(query).mockReturnValue(mockQuery as any)
      vi.mocked(where).mockReturnValue({} as any)
      vi.mocked(orderBy).mockReturnValue({} as any)
      vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe)

      const unsubscribe = todoService.subscribe(userId, callback)

      expect(query).toHaveBeenCalled()
      expect(where).toHaveBeenCalledWith('userId', '==', userId)
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc')
      expect(onSnapshot).toHaveBeenCalledWith(mockQuery, expect.any(Function))
      expect(unsubscribe).toBe(mockUnsubscribe)
    })

    it('deve processar snapshot e chamar callback com tarefas formatadas', () => {
      const userId = 'user-123'
      const callback = vi.fn()
      
      const mockSnapshot = {
        docs: [
          {
            id: 'task-1',
            data: () => ({
              title: 'Tarefa 1',
              description: 'Desc 1',
              status: 'todo',
              userId: 'user-123',
              createdAt: { toDate: () => new Date('2025-01-01') },
              updatedAt: { toDate: () => new Date('2025-01-02') }
            })
          },
          {
            id: 'task-2', 
            data: () => ({
              title: 'Tarefa 2',
              description: '',
              status: 'done',
              userId: 'user-123',
              createdAt: { toDate: () => new Date('2025-01-03') },
              updatedAt: { toDate: () => new Date('2025-01-04') }
            })
          }
        ]
      }

      let snapshotCallback: (snapshot: any) => void
      vi.mocked(onSnapshot).mockImplementation((_query, cb) => {
        snapshotCallback = cb as any
        return vi.fn()
      })

      todoService.subscribe(userId, callback)
      snapshotCallback!(mockSnapshot)

      expect(callback).toHaveBeenCalledWith([
        {
          id: 'task-1',
          title: 'Tarefa 1', 
          description: 'Desc 1',
          status: 'todo',
          userId: 'user-123',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-02')
        },
        {
          id: 'task-2',
          title: 'Tarefa 2',
          description: '',
          status: 'done', 
          userId: 'user-123',
          createdAt: new Date('2025-01-03'),
          updatedAt: new Date('2025-01-04')
        }
      ])
    })

    it('deve lidar com tarefas sem descrição', () => {
      const userId = 'user-123'
      const callback = vi.fn()
      
      const mockSnapshot = {
        docs: [
          {
            id: 'task-1',
            data: () => ({
              title: 'Tarefa sem descrição',
              status: 'todo',
              userId: 'user-123',
              createdAt: { toDate: () => new Date() },
              updatedAt: { toDate: () => new Date() }
            })
          }
        ]
      }

      let snapshotCallback: (snapshot: any) => void
      vi.mocked(onSnapshot).mockImplementation((_query, cb) => {
        snapshotCallback = cb as any
        return vi.fn()
      })

      todoService.subscribe(userId, callback)
      snapshotCallback!(mockSnapshot)

      expect(callback).toHaveBeenCalledWith([
        expect.objectContaining({
          description: ''
        })
      ])
    })
  })
})
