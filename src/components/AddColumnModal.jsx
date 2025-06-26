import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Palette } from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import toast from 'react-hot-toast'

const AddColumnModal = () => {
  const [selectedColor, setSelectedColor] = useState('#6b7280')
  
  const { 
    isAddColumnModalOpen, 
    addColumn, 
    setAddColumnModalOpen 
  } = useKanbanStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const predefinedColors = [
    { name: 'Gray', value: '#6b7280' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Lime', value: '#84cc16' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Indigo', value: '#6366f1' }
  ]

  const onSubmit = (data) => {
    try {
      addColumn(data.title, selectedColor)
      toast.success('Column created successfully!')
      reset()
      setSelectedColor('#6b7280')
      handleClose()
    } catch (error) {
      toast.error('Error creating column!')
      console.error(error)
    }
  }

  const handleClose = () => {
    reset()
    setSelectedColor('#6b7280')
    setAddColumnModalOpen(false)
  }

  if (!isAddColumnModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">
            Create New Column
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
          {/* Column Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Column Name *
            </label>
            <input
              type="text"
              {...register('title', { 
                required: 'Column name is required',
                minLength: {
                  value: 2,
                  message: 'Column name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Column name cannot exceed 50 characters'
                }
              })}
              className="minimal-input"
              placeholder="Enter column name..."
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-3">
              <Palette className="h-4 w-4 inline mr-1" />
              Column Color
            </label>
            
            {/* Selected Color Preview */}
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-6 h-6 rounded-full border border-neutral-300"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-sm text-neutral-600">
                Selected: {predefinedColors.find(c => c.value === selectedColor)?.name || 'Custom'}
              </span>
            </div>

            {/* Color Palette */}
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-neutral-900 ring-2 ring-blue-500'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="mt-4">
              <label className="block text-xs text-neutral-500 mb-1">
                Custom Color (Hex)
              </label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-8 border border-neutral-300 rounded-md cursor-pointer"
              />
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddColumnModal 