import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { TileProvider } from './context/TileContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TileProvider>
        <App />
      </TileProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
