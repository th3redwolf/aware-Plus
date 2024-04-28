import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from '../routes/Layout.jsx';
import Create from '../routes/Create.jsx';
import View from '../routes/View.jsx';
import LoginRoute from '../routes/LoginRoute.jsx';
import Profile from '../routes/Profile.jsx';
import SignUpRoute from '../routes/SignUpRoute.jsx';
import NotFound from '../routes/NotFound.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index={true} element={<App/>}/>
                <Route index={false} path="/create" element={<Create/>}/>
                <Route index={false} path="/view-post/:id" element={<View/>}/>
                <Route index={false} path="/login" element={<LoginRoute/>}/>
                <Route index={false} path="/signup" element={<SignUpRoute/>}/>
                <Route index={false} path="/myProfile" element={<Profile/>}/>
            </Route>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
