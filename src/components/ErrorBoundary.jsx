import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Error'u log'la (production'da external service'e gönder)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bir Hata Oluştu
            </h1>
            
            <p className="text-gray-600 mb-6">
              Üzgünüz, beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-md">
                <h3 className="font-semibold text-red-800 mb-2">Hata Detayları:</h3>
                <pre className="text-xs text-red-700 text-left overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 