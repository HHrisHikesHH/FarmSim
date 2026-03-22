import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import './styles/index.css'
import { useSimStore } from './store/useSimStore.js'

if (typeof window !== 'undefined') {
  window.debugSim = () => useSimStore.getState().startSimulation()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
