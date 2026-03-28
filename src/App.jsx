import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import Assignments from './pages/Assignments'
import Leaderboard from './pages/Leaderboard'
import Shop from './pages/Shop'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App