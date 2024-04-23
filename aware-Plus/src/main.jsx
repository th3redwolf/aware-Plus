import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from '../routes/Layout.jsx';
import Create from '../routes/Create.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index={true} element={<App/>}/>
                <Route index={false} path="/create" element={<Create/>}/>

            </Route>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
