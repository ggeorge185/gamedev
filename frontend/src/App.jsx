import { useEffect } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import SearchPage from './components/SearchPage'
import MyWords from './components/MyWords'
import MiniGameTable from './components/MiniGameTable' // <-- Import the new component
import GameUserLogin from './components/GameUserLogin'
import GameUserSignup from './components/GameUserSignup'
import GameDashboard from './components/GameDashboard'
import StoryMode from './components/StoryMode'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoutes from './components/ProtectedRoutes'
import GameProtectedRoutes from './components/GameProtectedRoutes'

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
        path: '/mini-game-table', // <-- Mini Game Table added
        element: <ProtectedRoutes><MiniGameTable /></ProtectedRoutes>
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
  // Game User Routes
  {
    path: '/game-login',
    element: <GameUserLogin />
  },
  {
    path: '/game-signup',
    element: <GameUserSignup />
  },
  {
    path: '/game',
    element: <GameProtectedRoutes><GameDashboard /></GameProtectedRoutes>
  },
  {
    path: '/game/story-mode',
    element: <GameProtectedRoutes><StoryMode /></GameProtectedRoutes>
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
