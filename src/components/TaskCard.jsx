import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { 
  Calendar, 
  Paperclip, 
  CheckSquare, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { format, isAfter, isBefore, isToday } from 'date-fns'
import { useKanbanStore } from '../store/kanbanStore'
import TaskModal from './TaskModal'

const TaskCard = ({ task, index, isSelected }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { deleteTask, selectTask, setTaskModalOpen, setEditingTask } = useKanbanStore()

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />
      case 'medium': return <Clock className="h-3 w-3" />
      case 'low': return <CheckSquare className="h-3 w-3" />
      default: return null
    }
  }

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null
    
    const now = new Date()
    const due = new Date(dueDate)
    
    if (isToday(due)) {
      return { text: 'Today', color: 'text-amber-700 bg-amber-100' }
    } else if (isBefore(due, now)) {
      return { text: 'Overdue', color: 'text-red-700 bg-red-100' }
    } else {
      return { text: format(due, 'dd MMM'), color: 'text-neutral-600 bg-neutral-100' }
    }
  }

  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length
  const totalSubtasks = task.subtasks.length

  const dueDateStatus = getDueDateStatus(task.dueDate)

  const handleSelectTask = (e) => {
    e.stopPropagation()
    selectTask(task.id)
  }

  const handleDeleteTask = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
    }
  }

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card minimal-card p-3 cursor-pointer group ${
              snapshot.isDragging ? 'is-dragging' : ''
            } ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            onClick={() => {
              setEditingTask(task)
              setTaskModalOpen(true)
            }}
          >
            {/* Task Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-2 flex-1">
                {/* Selection Checkbox */}
                <button
                  onClick={handleSelectTask}
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 transition-all duration-150 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-neutral-300 hover:border-blue-400'
                  }`}
                >
                  {isSelected && (
                    <CheckSquare className="h-3 w-3 text-white" />
                  )}
                </button>

                {/* Priority Indicator */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {getPriorityIcon(task.priority)}
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(!isMenuOpen)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-100 rounded transition-all duration-150"
                >
                  <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                </button>

                {/* Context Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-6 mt-1 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg z-40">
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingTask(task)
                          setTaskModalOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTask()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Task Title */}
            <h4 className="font-medium text-neutral-900 mb-2 text-sm leading-snug">
              {task.title}
            </h4>

            {/* Task Description */}
            {task.description && (
              <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded font-medium">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Progress Bar for Subtasks */}
            {totalSubtasks > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-600 flex items-center font-medium">
                    <CheckSquare className="h-3 w-3 mr-1" />
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {Math.round((completedSubtasks / totalSubtasks) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Task Footer */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {/* Due Date */}
                {dueDateStatus && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded ${dueDateStatus.color}`}>
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">{dueDateStatus.text}</span>
                  </div>
                )}

                {/* Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="flex items-center space-x-1 text-neutral-500">
                    <Paperclip className="h-3 w-3" />
                    <span>{task.attachments.length}</span>
                  </div>
                )}
              </div>

              {/* Creation Date */}
              <span className="text-neutral-500 font-medium">
                {format(new Date(task.createdAt), 'dd MMM')}
              </span>
            </div>
          </div>
        )}
      </Draggable>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

export default TaskCard 