import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import AppShell from './components/layout/AppShell'
import Dashboard from './components/dashboard/Dashboard'
import History from './pages/History'
import Achievements from './pages/Achievements'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journey" element={<History />} />
          <Route path="/character" element={<Achievements />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App