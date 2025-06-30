import React, { useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Toaster } from 'react-hot-toast'
import { useKanbanStore } from './store/kanbanStore'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import LoadingSpinner from './components/LoadingSpinner'
import BulkActionBar from './components/BulkActionBar'
import TaskModal from './components/TaskModal'
import AddColumnModal from './components/AddColumnModal'
import FilterPanel from './components/FilterPanel'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const { 
    isLoading,
    isTaskModalOpen,
    isAddColumnModalOpen,
    isFilterPanelOpen,
    moveTask,
    reorderColumns,
    selectedTasks,
    setLoading
  } = useKanbanStore()

  // Simulated loading for initial app load
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [setLoading])

  const handleDragEnd = (result) => {
    const { destination, source, type } = result

    // Dropped outside the list
    if (!destination) return

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Column reordering
    if (type === 'column') {
      reorderColumns(source.index, destination.index)
      return
    }

    // Task movement
    if (type === 'task') {
      moveTask(result.draggableId, destination.droppableId, destination.index)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        
        {selectedTasks.length > 0 && <BulkActionBar />}
        
        <main className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 overflow-x-hidden">
          <div className="flex gap-6">
            <FilterPanel />
            <div className="flex-1 min-w-0">
              <DragDropContext onDragEnd={handleDragEnd}>
                <KanbanBoard />
              </DragDropContext>
            </div>
          </div>
        </main>
        
        {/* Modals */}
        {isTaskModalOpen && <TaskModal />}
        {isAddColumnModalOpen && <AddColumnModal />}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#171717',
              color: '#fafafa',
              border: '1px solid #404040',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App 