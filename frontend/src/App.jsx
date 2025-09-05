import { useEffect } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import SearchPage from './components/SearchPage'
import MyWords from './components/MyWords'
import Games from './components/Games'
import Scenarios from './components/Scenarios'
import ScenarioCollections from './components/ScenarioCollections'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoutes from './components/ProtectedRoutes'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: '/search',
        element: <ProtectedRoutes><SearchPage /></ProtectedRoutes>
      },
      {
        path: '/my-words',
        element: <ProtectedRoutes><MyWords /></ProtectedRoutes>
      },
      {
        path: '/games',
        element: <ProtectedRoutes><Games /></ProtectedRoutes>
      },
      {
        path: '/scenarios',
        element: <ProtectedRoutes><Scenarios /></ProtectedRoutes>
      },
      {
        path: '/scenario-collections',
        element: <ProtectedRoutes><ScenarioCollections /></ProtectedRoutes>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

function App() {
  const { user } = useSelector(store => store.auth);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
