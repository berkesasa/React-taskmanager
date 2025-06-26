import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { 
  Plus, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  GripVertical 
} from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import TaskCard from './TaskCard'

const KanbanColumn = ({ column, dragHandleProps, isDragging }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)

  const { 
    getTasksByColumn, 
    updateColumn, 
    deleteColumn,
    selectedTasks,
    setTaskModalOpen,
    setEditingTask
  } = useKanbanStore()

  const tasks = getTasksByColumn(column.id)

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      updateColumn(column.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleDeleteColumn = () => {
    if (tasks.length > 0) {
      const confirmed = confirm(
        `This column has ${tasks.length} task(s). Are you sure you want to delete it?`
      )
      if (!confirmed) return
    }
    deleteColumn(column.id)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      setEditTitle(column.title)
      setIsEditing(false)
    }
  }

  return (
    <>
      <div className={`w-80 minimal-card ${
        isDragging ? 'opacity-75 rotate-2 scale-105' : ''
      }`}>
        {/* Column Header */}
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {/* Drag Handle */}
              <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-100 rounded-lg">
                <GripVertical className="h-4 w-4 text-neutral-400" />
              </div>

              {/* Column Color Indicator */}
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: column.color }}
              />

              {/* Title */}
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={handleKeyPress}
                  className="minimal-input flex-1 text-sm font-semibold"
                  autoFocus
                />
              ) : (
                <h3 
                  className="flex-1 text-sm font-semibold text-neutral-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {column.title}
                </h3>
              )}

              {/* Task Count */}
              <span className="bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-md font-medium">
                {tasks.length}
              </span>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-neutral-400" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-8 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-30">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsEditing(true)
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Column</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setEditingTask(null)
                        setTaskModalOpen(true, column.id)
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Task</span>
                    </button>
                    
                    <div className="border-t border-neutral-100 my-1" />
                    
                    <button
                      onClick={() => {
                        handleDeleteColumn()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Column</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

                {/* Tasks List */}
        <Droppable droppableId={column.id} type="task">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-4 space-y-3 min-h-32 max-h-96 overflow-y-auto ${
                snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  isSelected={selectedTasks.includes(task.id)}
                />
              ))}
              
              {provided.placeholder}

              {/* Add Task Button */}
              <button
                onClick={() => {
                  setEditingTask(null)
                  setTaskModalOpen(true, column.id)
                }}
                className="w-full p-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-blue-400 hover:text-blue-600 transition-all duration-150 text-sm"
              >
                <Plus className="h-4 w-4 mx-auto mb-1" />
                <span>Add Task</span>
              </button>
            </div>
          )}
        </Droppable>
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

export default KanbanColumn 