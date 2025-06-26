import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, Columns } from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import KanbanColumn from './KanbanColumn'

const KanbanBoard = () => {
  const { columns, setAddColumnModalOpen } = useKanbanStore()

  return (
    <div className="flex flex-col h-full">
      {/* Board Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-1">
              Project Board
            </h2>
            <p className="text-neutral-500">
              {columns.length} {columns.length === 1 ? 'column' : 'columns'}
            </p>
          </div>
          <button
            onClick={() => setAddColumnModalOpen(true)}
            className="minimal-button minimal-button-secondary"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-2">Add Column</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <Droppable 
        droppableId="board" 
        direction="horizontal" 
        type="column"
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex gap-6 pb-6 min-h-[600px] overflow-x-auto ${
              snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
            }`}
          >
            {/* Existing Columns */}
            {columns.map((column, index) => (
              <Draggable
                key={column.id}
                draggableId={column.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex-shrink-0 ${
                      snapshot.isDragging ? 'opacity-75 rotate-2 scale-105' : ''
                    }`}
                    style={provided.draggableProps.style}
                  >
                    <KanbanColumn
                      column={column}
                      dragHandleProps={provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {/* Add Column Card - Only show if there are existing columns */}
            {columns.length > 0 && (
              <div className="flex-shrink-0 w-80">
                <button
                  onClick={() => setAddColumnModalOpen(true)}
                  className="w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:border-blue-400 hover:text-blue-600 transition-all duration-150"
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="font-medium">Add Column</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Empty State */}
      {columns.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="p-6 bg-neutral-100 rounded-2xl mb-6">
            <Columns className="h-12 w-12 text-neutral-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No columns yet
          </h3>
          <p className="text-neutral-500 mb-6 max-w-md">
            Create your first column to start organizing your tasks
          </p>
          <button
            onClick={() => setAddColumnModalOpen(true)}
            className="minimal-button minimal-button-primary"
          >
            Create First Column
          </button>
        </div>
      )}
    </div>
  )
}

export default KanbanBoard 