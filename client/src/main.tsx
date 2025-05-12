import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/ui/theme-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
