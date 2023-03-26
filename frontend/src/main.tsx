import React from 'react';
import ReactDOM from 'react-dom/client';
import AccountPage from "./pages/account/App";
import ChatPage from "./pages/chat/App";
import HomePage from "./pages/home/App";
import LoginPage from "./pages/login/App";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './assets/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>
  },
  {
    path: '/login',
    element: <LoginPage/>
  },
  {
    path: '/account',
    element: <AccountPage/>
  },
  {
    path: '/chat/:id',
    element: <ChatPage/>
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
