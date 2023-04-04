import React from 'react';
import ReactDOM from 'react-dom/client';
import AccountPage from "./pages/account/App";
import ChatPage from "./pages/chat/App";
import HomePage from "./pages/home/App";
import LoginPage from "./pages/login/App";
import Layout from './Layout';
import { ProtectedRoute } from './helpers/auth';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import './assets/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      { path: "", element: <ProtectedRoute><HomePage/></ProtectedRoute> },
      { path: "/login", element: <ProtectedRoute><LoginPage/></ProtectedRoute> },
      { path: "/account", element: <ProtectedRoute><AccountPage/></ProtectedRoute> },
      { path: "/chat/:id", element: <ProtectedRoute><ChatPage/></ProtectedRoute> },
    ]
  },
  { path: "*", element: <Navigate to='/' replace/>},
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
