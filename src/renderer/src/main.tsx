import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { ThemeProvider } from './components/theme-provider'
import { Router } from './router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <Router />
    </ThemeProvider>
  </React.StrictMode>
)
