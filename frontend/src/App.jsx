import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Etudiants from './pages/Etudiants'
import EtudiantDetail from './pages/EtudiantDetail'
import Classes from './pages/Classes'
import Paiements from './pages/Paiements'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/etudiants" element={<Etudiants />} />
              <Route path="/etudiants/:id" element={<EtudiantDetail />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/paiements" element={<Paiements />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}