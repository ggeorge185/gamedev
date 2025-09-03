import { useEffect } from 'react'
import GameDashboard from './components/GameDashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import StoryMode from './components/StoryMode'
import GameSelection from './components/GameSelection'
import ScenarioSelection from './components/ScenarioSelection'
import JumbledLettersGame from './components/games/JumbledLettersGame'
import TabooGame from './components/games/TabooGame'
import QuizGame from './components/games/QuizGame'
import MemoryGame from './components/games/MemoryGame'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoutes from './components/ProtectedRoutes'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><GameDashboard /></ProtectedRoutes>
  },
  {
    path: "/story-mode",
    element: <ProtectedRoutes><StoryMode /></ProtectedRoutes>
  },
  {
    path: "/game-selection",
    element: <ProtectedRoutes><GameSelection /></ProtectedRoutes>
  },
  {
    path: "/scenario/:scenarioId",
    element: <ProtectedRoutes><ScenarioSelection /></ProtectedRoutes>
  },
  {
    path: "/game/jumbled_letters",
    element: <ProtectedRoutes><JumbledLettersGame /></ProtectedRoutes>
  },
  {
    path: "/game/taboo",
    element: <ProtectedRoutes><TabooGame /></ProtectedRoutes>
  },
  {
    path: "/game/quiz",
    element: <ProtectedRoutes><QuizGame /></ProtectedRoutes>
  },
  {
    path: "/game/memory_game",
    element: <ProtectedRoutes><MemoryGame /></ProtectedRoutes>
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
  const dispatch = useDispatch();

  // Remove socket.io functionality since we're focusing on language learning games
  
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
