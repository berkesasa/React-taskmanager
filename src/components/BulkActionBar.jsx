import React, { useState } from 'react'
import { 
  X, 
  Trash2, 
  Move, 
  CheckSquare,
  Square,
  ChevronDown
} from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import toast from 'react-hot-toast'

const BulkActionBar = () => {
  const [isColumnSelectOpen, setIsColumnSelectOpen] = useState(false)
  
  const { 
    selectedTasks, 
    clearSelection, 
    deleteSelectedTasks, 
    moveSelectedTasks,
    selectAllTasks,
    tasks,
    columns
  } = useKanbanStore()

  const isAllSelected = selectedTasks.length === tasks.length && tasks.length > 0

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection()
    } else {
      selectAllTasks()
    }
  }

  const handleDeleteSelected = () => {
    const count = selectedTasks.length
    if (confirm(`Are you sure you want to delete ${count} task(s)?`)) {
      deleteSelectedTasks()
      toast.success(`${count} task(s) deleted`)
    }
  }

  const handleMoveToColumn = (columnId) => {
    const column = columns.find(col => col.id === columnId)
    const count = selectedTasks.length
    
    moveSelectedTasks(columnId)
    setIsColumnSelectOpen(false)
    toast.success(`${count} task(s) moved to "${column.title}"`)
  }

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="minimal-button minimal-button-secondary text-sm"
            >
              {isAllSelected ? (
                <CheckSquare className="h-4 w-4 text-blue-600" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span className="ml-2">
                {selectedTasks.length > 0 
                  ? `${selectedTasks.length} selected`
                  : 'Select all'
                }
              </span>
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedTasks.length > 0 && (
            <div className="flex items-center space-x-2">
              {/* Move To Column */}
              <div className="relative">
                <button
                  onClick={() => setIsColumnSelectOpen(!isColumnSelectOpen)}
                  className="minimal-button minimal-button-secondary text-sm"
                >
                  <Move className="h-4 w-4" />
                  <span className="ml-2">Move</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {/* Column Dropdown */}
                {isColumnSelectOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-40">
                    <div className="py-1">
                      {columns.map(column => (
                        <button
                          key={column.id}
                          onClick={() => handleMoveToColumn(column.id)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: column.color }}
                          />
                          <span>{column.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delete Selected */}
              <button
                onClick={handleDeleteSelected}
                className="minimal-button bg-red-50 text-red-700 border-red-200 hover:bg-red-100 text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span className="ml-2">Delete</span>
              </button>

              {/* Clear Selection */}
              <button
                onClick={clearSelection}
                className="minimal-button minimal-button-ghost"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isColumnSelectOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsColumnSelectOpen(false)}
        />
      )}
    </div>
  )
}

export default BulkActionBar 