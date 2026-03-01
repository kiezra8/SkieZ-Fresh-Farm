import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './index.css'

// ── Error Boundary: catches any JS crash and shows a helpful screen ───────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[SkieZ ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f1117', color: '#f0f0f0',
          fontFamily: 'system-ui, sans-serif', padding: 24, textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 8, color: '#ef4444' }}>Something went wrong</h2>
          <p style={{ color: '#9ca3af', maxWidth: 420, marginBottom: 24, fontSize: 14 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 28px', background: '#10b981', border: 'none',
              borderRadius: 8, color: '#fff', fontWeight: 700,
              fontSize: 14, cursor: 'pointer'
            }}
          >
            Reload App
          </button>
          <p style={{ marginTop: 16, fontSize: 12, color: '#4b5563' }}>
            If this keeps happening, check the browser console for details.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

