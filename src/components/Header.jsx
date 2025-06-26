import React from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload,
  MoreHorizontal,
  Kanban,
  X
} from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import toast from 'react-hot-toast'

const Header = () => {
  const { 
    searchQuery, 
    setSearchQuery,
    exportData,
    importData,
    clearFilters,
    filterTag,
    filterPriority,
    setTaskModalOpen,
    setFilterPanelOpen,
    isFilterPanelOpen
  } = useKanbanStore()

  const handleExport = () => {
    try {
      const data = exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          importData(data)
          toast.success('Data imported successfully')
        } catch (error) {
          toast.error('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
    event.target.value = ''
  }

  const hasActiveFilters = filterTag || filterPriority || searchQuery

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Kanban className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Kanban Board
              </h1>
              <p className="text-sm text-neutral-500">
                Manage your tasks efficiently
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="minimal-input !pl-8 w-64"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setFilterPanelOpen(!isFilterPanelOpen)}
              className={`minimal-button relative ${
                hasActiveFilters 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'minimal-button-secondary'
              }`}
              title="Filters"
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
              )}
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="minimal-button minimal-button-ghost"
                title="Clear Filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Add Task Button */}
            <button
              onClick={() => setTaskModalOpen(true)}
              className="minimal-button minimal-button-primary"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Add Task</span>
            </button>

            {/* More Options */}
            <div className="relative group">
              <button className="minimal-button minimal-button-secondary">
                <MoreHorizontal className="h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="py-1">
                  <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </button>
                  
                  <label className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Import Data</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 