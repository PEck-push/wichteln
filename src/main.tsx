import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Admin } from './screens/Admin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {location.pathname.replace(/\/$/, '') === '/admin-wichtel' ? <main className="device"><Admin /></main> : <App />}
  </StrictMode>,
)
