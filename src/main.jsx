import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', padding: '24px',
          fontFamily: 'system-ui, sans-serif', textAlign: 'center',
          background: '#F5EFE4',
        }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>☕</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1A0F07', marginBottom: 8 }}>
            Roastly a rencontré un problème
          </p>
          <p style={{ fontSize: 13, color: '#8C7060', marginBottom: 20, maxWidth: 300, lineHeight: 1.6 }}>
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button onClick={() => window.location.reload()} style={{
            background: '#C47A2A', color: 'white', border: 'none',
            borderRadius: 99, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Recharger l'application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
