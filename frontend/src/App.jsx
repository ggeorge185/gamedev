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
import StoryModeDemo from './components/StoryModeDemo'
import GameSelection from './components/GameSelection'
import GameTypeManagement from './components/GameTypeManagement'
import ScenarioConfiguration from './components/ScenarioConfiguration'
import ScenarioGame from './components/ScenarioGame'
import GamesComponent from './components/games-component'
import ScenariosComponent from './components/scenarios-component'
import ScenarioCollections from './components/scenario-collections'
import Games from './components/Games'
import Scenarios from './components/Scenarios'
import DemoPage from './components/DemoPage'
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
      {
        path: '/game-types',
        element: <ProtectedRoutes><GameTypeManagement /></ProtectedRoutes>
      },
      {
        path: '/scenario-config',
        element: <ProtectedRoutes><ScenarioConfiguration /></ProtectedRoutes>
      },
      {
        path: '/admin/games',
        element: <ProtectedRoutes><GamesComponent /></ProtectedRoutes>
      },
      {
        path: '/admin/scenarios',
        element: <ProtectedRoutes><ScenariosComponent /></ProtectedRoutes>
      },
      {
        path: '/admin/scenario-collections',
        element: <ProtectedRoutes><ScenarioCollections /></ProtectedRoutes>
      },
      {
        path: '/games',
        element: <ProtectedRoutes><Games /></ProtectedRoutes>
      },
      {
        path: '/scenarios',
        element: <ProtectedRoutes><Scenarios /></ProtectedRoutes>
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
  {
    path: '/game/game-selection',
    element: <GameProtectedRoutes><GameSelection /></GameProtectedRoutes>
  },
  {
    path: '/game/scenario/:scenarioId',
    element: <GameProtectedRoutes><ScenarioGame /></GameProtectedRoutes>
  },
  {
    path: '/demo/story-mode',
    element: <StoryModeDemo />
  },
  {
    path: '/demo',
    element: <DemoPage />
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
