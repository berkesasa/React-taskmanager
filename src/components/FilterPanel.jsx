import React from 'react'
import { X, Tag, Flag, Trash2 } from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'

const FilterPanel = () => {
  const { 
    isFilterPanelOpen,
    filterTag, 
    filterPriority, 
    setFilterTag, 
    setFilterPriority, 
    clearFilters,
    getAllTags,
    setFilterPanelOpen
  } = useKanbanStore()

  const availableTags = getAllTags()
  const priorities = [
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' }
  ]

  const handleClose = () => {
    setFilterPanelOpen(false)
  }

  const handleClearFilters = () => {
    clearFilters()
    handleClose()
  }

  if (!isFilterPanelOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50">
      {/* Side Panel */}
      <div className="bg-white w-full max-w-sm h-full shadow-xl overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Filters</h2>
          <button
            onClick={handleClose}
            className="minimal-button minimal-button-ghost"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Current Filters Summary */}
          {(filterTag || filterPriority) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-blue-900">
                  Active Filters
                </h3>
                <button
                  onClick={handleClearFilters}
                  className="minimal-button minimal-button-ghost text-blue-600"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="space-y-2">
                {filterTag && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-900">Tag: {filterTag}</span>
                  </div>
                )}
                {filterPriority && (
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-900">
                      Priority: {priorities.find(p => p.value === filterPriority)?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Priority Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-900 flex items-center">
              <Flag className="h-4 w-4 mr-2" />
              Priority Level
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-50">
                <input
                  type="radio"
                  name="priority"
                  value=""
                  checked={!filterPriority}
                  onChange={() => setFilterPriority('')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-neutral-900">All</span>
              </label>
              
              {priorities.map(priority => (
                <label key={priority.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={filterPriority === priority.value}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm ${priority.color}`}>
                    {priority.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-900 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </h3>
            
            {availableTags.length > 0 ? (
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="tag"
                    value=""
                    checked={!filterTag}
                    onChange={() => setFilterTag('')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-neutral-900">All</span>
                </label>
                
                {availableTags.map(tag => (
                  <label key={tag} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="tag"
                      value={tag}
                      checked={filterTag === tag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                No tags created yet
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 border-t border-neutral-200">
          <div className="flex gap-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 minimal-button minimal-button-ghost"
            >
              Clear
            </button>
            <button
              onClick={handleClose}
              className="flex-1 minimal-button minimal-button-primary"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={handleClose}
      />
    </div>
  )
}

export default FilterPanel 