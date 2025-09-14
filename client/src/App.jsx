import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Appointments from './pages/Appointments'
import CreateAppointment from './pages/CreateAppointment'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { getUserFromStorage } from './utils/auth'
import './styles/theme.css'

export default function App(){
  const [theme, setTheme] = useState(localStorage.getItem('theme')||'light')
  const [user, setUser] = useState(getUserFromStorage())
  const navigate = useNavigate()

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  },[theme])

  const handleLogout = ()=>{
    localStorage.removeItem('hospital_token')
    localStorage.removeItem('hospital_user')
    setUser(null)
    navigate('/login')
  }

  return (
    <div className='app-root'>
      <Navbar theme={theme} setTheme={setTheme} user={user} onLogout={handleLogout} />
      <div className='container-fluid mt-3'>
        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/login' element={<Login onAuth={(u)=>setUser(u)} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<ProtectedRoute setUser={setUser}><Dashboard /></ProtectedRoute>} />
          <Route path='/patients' element={<ProtectedRoute setUser={setUser}><Patients /></ProtectedRoute>} />
          <Route path='/doctors' element={<ProtectedRoute setUser={setUser}><Doctors /></ProtectedRoute>} />
          <Route path='/appointments' element={<ProtectedRoute setUser={setUser}><Appointments /></ProtectedRoute>} />
          <Route path='/appointments/create' element={<ProtectedRoute setUser={setUser}><CreateAppointment /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}
