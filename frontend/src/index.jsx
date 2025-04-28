import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createGlobalStyle } from 'styled-components/macro'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.common['Content-Type'] = 'application/json'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
