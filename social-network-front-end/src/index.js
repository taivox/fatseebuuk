import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Feed from './components/Feed';
import Friends from './components/Friends';
import Groups from './components/Groups';

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children: [
      {index:true,element:<Feed/>},
      {
        path:"/friends",
        element:<Friends/>,
      },
      {
        path:"/groups",
        element:<Groups/>,
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
);