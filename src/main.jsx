import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This is the standard React "entry point": it finds the empty
// <div id="root"> in index.html and tells React to render <App />
// inside it. You will rarely need to touch this file again.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
