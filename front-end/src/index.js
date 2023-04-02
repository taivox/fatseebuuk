import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Feed from './components/main/Feed';
import Friends from './components/main/Friends';
import Group from './components/Group';
import Groups from './components/main/Groups';
import Profile from './components/Profile';
import GroupEvents from './components/group/GroupEvents';
import GroupPosts from './components/group/GroupPosts';

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
  },
  {
    path:"/profile/:id",
    element:<Profile/>,
  },
  {
    path:"/groups/:id",
    element:<Group/>,
    children: [
      {
        path:"events",
        element:<GroupEvents/>,
      },
      {
        path:"",
        element:<GroupPosts/>,
      },
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
);