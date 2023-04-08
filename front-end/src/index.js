import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Feed from './components/main/Feed'
import Friends from './components/main/Friends'
import Group from './components/Group'
import Groups from './components/main/Groups'
import Profile from './components/Profile'
import GroupEvents from './components/group/GroupEvents'
import GroupEvent from './components/group/GroupEvent'
import GroupPosts from './components/group/GroupPosts'
import Login from './components/Login'
import Register from './components/Register'
import ErrorPage from './components/common/ErrorPage'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Feed /> },
      {
        path: "/friends",
        element: <Friends />,
      },
      {
        path: "/groups",
        element: <Groups />,
      },
    ]
  },
  {
    path: "/profile/:user_id",
    errorElement: <ErrorPage />,
    element: <Profile />,
  },
  {
    path: "/groups/:group_id",
    errorElement: <ErrorPage />,
    element: <Group />,
    children: [
      {
        path: "events",
        element: <GroupEvents />,
      },
      {
        path: "",
        element: <GroupPosts />,
      },
      {
        path: "events/:event_id",
        element: <GroupEvent />
      }
    ]
  },
  {
    path: "/login",
    errorElement: <ErrorPage />,
    element: <Login />,
  },
  {
    path: "/register",
    errorElement: <ErrorPage />,
    element: <Register />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)