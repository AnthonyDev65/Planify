import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeCapacitor } from './capacitor'

// Inicializar Capacitor
initializeCapacitor().then(() => {
  console.log('Capacitor initialized');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
