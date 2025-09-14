import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUserFromStorage } from '../utils/auth'

export default function ProtectedRoute({ children }){
  const user = getUserFromStorage()
  if (!user) return <Navigate to='/login' replace />
  return children
}
