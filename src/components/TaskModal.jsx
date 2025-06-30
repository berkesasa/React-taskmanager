import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  X, 
  Calendar, 
  Tag, 
  Flag, 
  Plus, 
  Trash2, 
  CheckSquare,
  Square
} from 'lucide-react'
import DatePicker from 'react-datepicker'
import { useKanbanStore } from '../store/kanbanStore'
import toast from 'react-hot-toast'
import "react-datepicker/dist/react-datepicker.css"

const TaskModal = () => {
  const { 
    isTaskModalOpen,
    editingTask,
    defaultColumnId,
    columns, 
    addTask, 
    updateTask, 
    addSubtask, 
    toggleSubtask, 
    deleteSubtask,
    setTaskModalOpen,
    setEditingTask
  } = useKanbanStore()

  const [selectedDate, setSelectedDate] = useState(editingTask?.dueDate ? new Date(editingTask.dueDate) : null)
  const [tags, setTags] = useState(editingTask?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [subtasks, setSubtasks] = useState(editingTask?.subtasks || [])
  const [subtaskInput, setSubtaskInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      title: editingTask?.title || '',
      description: editingTask?.description || '',
      priority: editingTask?.priority || 'medium',
      columnId: editingTask?.columnId || defaultColumnId || (columns[0]?.id || '')
    }
  })

  // Reset form when task changes
  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium',
        columnId: editingTask.columnId || defaultColumnId || (columns[0]?.id || '')
      })
      setSelectedDate(editingTask.dueDate ? new Date(editingTask.dueDate) : null)
      setTags(editingTask.tags || [])
      setSubtasks(editingTask.subtasks || [])
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        columnId: defaultColumnId || (columns[0]?.id || '')
      })
      setSelectedDate(null)
      setTags([])
      setSubtasks([])
    }
  }, [editingTask, defaultColumnId, columns, reset])

  useEffect(() => {
    if (isTaskModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isTaskModalOpen])

  const handleClose = () => {
    setTaskModalOpen(false)
    setEditingTask(null)
  }

  const onSubmit = async (data) => {
    try {
      const taskData = {
        ...data,
        dueDate: selectedDate,
        tags,
        subtasks
      }

      if (editingTask) {
        updateTask(editingTask.id, taskData)
        toast.success('Task updated successfully!')
      } else {
        addTask(taskData)
        toast.success('Task created successfully!')
      }

      handleClose()
    } catch (error) {
      toast.error('An error occurred!')
      console.error(error)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      const newSubtask = {
        id: Date.now().toString(),
        text: subtaskInput.trim(),
        completed: false
      }
      setSubtasks([...subtasks, newSubtask])
      setSubtaskInput('')
    }
  }

  const handleToggleSubtask = (subtaskId) => {
    if (editingTask) {
      toggleSubtask(editingTask.id, subtaskId)
    } else {
      setSubtasks(subtasks.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      ))
    }
  }

  const handleRemoveSubtask = (subtaskId) => {
    if (editingTask) {
      deleteSubtask(editingTask.id, subtaskId)
    } else {
      setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId))
    }
  }

  const handleSubtaskKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSubtask()
    }
  }

  if (!isTaskModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="minimal-button minimal-button-ghost"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="minimal-input"
              placeholder="Enter task title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="minimal-textarea"
              placeholder="Enter task description..."
            />
          </div>

          {/* Row: Column, Priority, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Column
              </label>
              <select
                {...register('columnId', { required: 'Column selection is required' })}
                className="minimal-select"
              >
                {columns.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                <Flag className="h-4 w-4 inline mr-1" />
                Priority
              </label>
              <select
                {...register('priority')}
                className="minimal-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Due Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date..."
                className="minimal-input"
                isClearable
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 minimal-input"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="minimal-button minimal-button-primary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              <CheckSquare className="h-4 w-4 inline mr-1" />
              Subtasks
            </label>
            <div className="space-y-2 mb-3">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className="flex-shrink-0"
                  >
                    {subtask.completed ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-neutral-400" />
                    )}
                  </button>
                  <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                    {subtask.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyPress={handleSubtaskKeyPress}
                className="flex-1 minimal-input"
                placeholder="Add subtask..."
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="minimal-button minimal-button-primary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleClose}
              className="minimal-button minimal-button-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="minimal-button minimal-button-primary"
            >
              {editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal 