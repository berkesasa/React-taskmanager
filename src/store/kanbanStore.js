import { create } from 'zustand'
import { nanoid } from 'nanoid'

// Initial data
const initialColumns = [
  { id: 'todo', title: 'To Do', color: '#9aa0a6' },
  { id: 'in-progress', title: 'In Progress', color: '#5f6368' },
  { id: 'review', title: 'Review', color: '#feca57' },
  { id: 'done', title: 'Done', color: '#48dbfb' }
]

const initialTasks = [
  {
    id: '1',
    title: 'Project Planning',
    description: 'Create detailed project plan and timeline for new initiative',
    priority: 'high',
    dueDate: new Date('2024-02-01'),
    tags: ['planning', 'project'],
    columnId: 'todo',
    createdAt: new Date(),
    attachments: [],
    subtasks: [
      { id: '1-1', text: 'Requirements analysis', completed: false },
      { id: '1-2', text: 'Create timeline', completed: true }
    ]
  },
  {
    id: '2',
    title: 'UI/UX Design',
    description: 'Design modern and user-friendly interface',
    priority: 'medium',
    dueDate: new Date('2024-02-15'),
    tags: ['design', 'frontend'],
    columnId: 'in-progress',
    createdAt: new Date(),
    attachments: [],
    subtasks: []
  }
]

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export const useKanbanStore = create((set, get) => ({
  // State
  columns: loadFromLocalStorage('kanban-columns', initialColumns),
  tasks: loadFromLocalStorage('kanban-tasks', initialTasks),
  selectedTasks: [],
  searchQuery: '',
  filterTag: '',
  filterPriority: '',
  isLoading: false,
  
  // Modal states
  isTaskModalOpen: false,
  isAddColumnModalOpen: false,
  isFilterPanelOpen: false,
  editingTask: null,
  defaultColumnId: null,

  // Column actions
  addColumn: (title, color) => {
    const newColumn = {
      id: nanoid(),
      title,
      color: color || '#6b7280'
    }
    
    set(state => {
      const newColumns = [...state.columns, newColumn]
      saveToLocalStorage('kanban-columns', newColumns)
      return { columns: newColumns }
    })
  },

  updateColumn: (columnId, updates) => {
    set(state => {
      const newColumns = state.columns.map(col =>
        col.id === columnId ? { ...col, ...updates } : col
      )
      saveToLocalStorage('kanban-columns', newColumns)
      return { columns: newColumns }
    })
  },

  deleteColumn: (columnId) => {
    set(state => {
      const newColumns = state.columns.filter(col => col.id !== columnId)
      const newTasks = state.tasks.filter(task => task.columnId !== columnId)
      
      saveToLocalStorage('kanban-columns', newColumns)
      saveToLocalStorage('kanban-tasks', newTasks)
      
      return { columns: newColumns, tasks: newTasks }
    })
  },

  reorderColumns: (sourceIndex, destinationIndex) => {
    set(state => {
      const newColumns = Array.from(state.columns)
      const [removed] = newColumns.splice(sourceIndex, 1)
      newColumns.splice(destinationIndex, 0, removed)
      
      saveToLocalStorage('kanban-columns', newColumns)
      return { columns: newColumns }
    })
  },

  // Task actions
  addTask: (taskData) => {
    const newTask = {
      id: nanoid(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      columnId: taskData.columnId,
      createdAt: new Date(),
      attachments: [],
      subtasks: []
    }

    set(state => {
      const newTasks = [...state.tasks, newTask]
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks }
    })
  },

  updateTask: (taskId, updates) => {
    set(state => {
      const newTasks = state.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks }
    })
  },

  deleteTask: (taskId) => {
    set(state => {
      const newTasks = state.tasks.filter(task => task.id !== taskId)
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks }
    })
  },

  moveTask: (taskId, newColumnId, newIndex) => {
    set(state => {
      const taskToMove = state.tasks.find(task => task.id === taskId)
      if (!taskToMove) return state

      const tasksInColumn = state.tasks.filter(task => 
        task.columnId === newColumnId && task.id !== taskId
      )

      const newTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, columnId: newColumnId }
        }
        return task
      })

      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks }
    })
  },

  // Subtask actions
  addSubtask: (taskId, text) => {
    const subtask = {
      id: nanoid(),
      text,
      completed: false
    }

    set(state => {
      const newTasks = state.tasks.map(task =>
        task.id === taskId 
          ? { ...task, subtasks: [...task.subtasks, subtask] }
          : task
      )
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks }
    })
  },

  toggleSubtask: (taskId, subtaskId) => {
    set(state => {
      const newTasks = state.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              )
            }
          : task
      )
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks }
    })
  },

  deleteSubtask: (taskId, subtaskId) => {
    set(state => {
      const newTasks = state.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
            }
          : task
      )
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks }
    })
  },

  // Selection actions
  selectTask: (taskId) => {
    set(state => ({
      selectedTasks: state.selectedTasks.includes(taskId)
        ? state.selectedTasks.filter(id => id !== taskId)
        : [...state.selectedTasks, taskId]
    }))
  },

  selectAllTasks: () => {
    set(state => ({
      selectedTasks: state.tasks.map(task => task.id)
    }))
  },

  clearSelection: () => {
    set({ selectedTasks: [] })
  },

  // Bulk operations
  deleteSelectedTasks: () => {
    set(state => {
      const newTasks = state.tasks.filter(task => 
        !state.selectedTasks.includes(task.id)
      )
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks, selectedTasks: [] }
    })
  },

  moveSelectedTasks: (columnId) => {
    set(state => {
      const newTasks = state.tasks.map(task =>
        state.selectedTasks.includes(task.id)
          ? { ...task, columnId }
          : task
      )
      saveToLocalStorage('kanban-tasks', newTasks)
      return { tasks: newTasks, selectedTasks: [] }
    })
  },

  // Filter actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterTag: (tag) => set({ filterTag: tag }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),

  clearFilters: () => set({ 
    searchQuery: '', 
    filterTag: '', 
    filterPriority: '' 
  }),

  // Utility actions
  setLoading: (loading) => set({ isLoading: loading }),

  exportData: () => {
    const { columns, tasks } = get()
    return {
      columns,
      tasks,
      exportedAt: new Date().toISOString()
    }
  },

  importData: (data) => {
    set(state => {
      if (data.columns) {
        saveToLocalStorage('kanban-columns', data.columns)
      }
      if (data.tasks) {
        saveToLocalStorage('kanban-tasks', data.tasks)
      }
      return {
        columns: data.columns || state.columns,
        tasks: data.tasks || state.tasks
      }
    })
  },

  // Computed getters
  getTasksByColumn: (columnId) => {
    const { tasks, searchQuery, filterTag, filterPriority } = get()
    
    return tasks.filter(task => {
      if (task.columnId !== columnId) return false
      
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) 
          && !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      if (filterTag && !task.tags.includes(filterTag)) {
        return false
      }
      
      if (filterPriority && task.priority !== filterPriority) {
        return false
      }
      
      return true
    })
  },

  getAllTags: () => {
    const { tasks } = get()
    const tags = new Set()
    tasks.forEach(task => {
      task.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  },

  // Modal actions
  setTaskModalOpen: (isOpen, columnId = null) => set({ 
    isTaskModalOpen: isOpen, 
    defaultColumnId: columnId 
  }),
  
  setAddColumnModalOpen: (isOpen) => set({ isAddColumnModalOpen: isOpen }),
  
  setFilterPanelOpen: (isOpen) => set({ isFilterPanelOpen: isOpen }),
  
  setEditingTask: (task) => set({ editingTask: task })
})) 