import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        </div>
        <p className="text-neutral-900 font-medium">{text}</p>
        <p className="text-neutral-500 text-sm mt-1">Setting up your workspace</p>
      </div>
    </div>
  )
}

export default LoadingSpinner 