import './style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Service Worker disabled to avoid caching issues
// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().catch(() => {
        // Silently fail
      })
    })
  })
}

// Add debug logging for production
if (import.meta.env.PROD) {
  console.log('🚀 App starting in production mode')
  console.log('📍 Environment check:', {
    hasFirebaseApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasFirebaseProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  })
}

const rootElement = document.querySelector<HTMLDivElement>('#app')

if (!rootElement) {
  console.error('❌ Failed to find the root element #app')
  document.body.innerHTML = '<div style="padding: 20px; text-align: center; font-family: system-ui;"><h1 style="color: #dc2626;">Erreur de chargement</h1><p>L\'élément racine de l\'application est introuvable.</p><p style="margin-top: 10px; color: #666; font-size: 14px;">Vérifiez que l\'élément #app existe dans index.html</p></div>'
} else {
  try {
    console.log('✅ Root element found, rendering app...')
    const root = createRoot(rootElement)
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    )
    console.log('✅ App rendered successfully')
  } catch (error) {
    console.error('❌ Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: system-ui; background: #f5f5f5; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 500px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #dc2626; margin-bottom: 20px;">Erreur de rendu</h1>
          <p style="color: #666; margin-bottom: 20px;">Impossible de charger l'application.</p>
          <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; text-align: left; font-size: 12px; overflow-x: auto; color: #dc2626; max-height: 200px; overflow-y: auto;">${error?.toString() || 'Erreur inconnue'}</pre>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
            Actualiser la page
          </button>
        </div>
      </div>
    `
  }
}

