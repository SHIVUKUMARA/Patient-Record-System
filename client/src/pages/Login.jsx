import React, { useState } from 'react'
import api from '../api/axios'
import { saveAuth } from '../utils/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await api.post('/api/auth/login', { email, password })
      saveAuth(res.data.token, { _id: res.data._id, name: res.data.name, role: res.data.role })
      onAuth && onAuth({ _id: res.data._id, name: res.data.name, role: res.data.role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '70vh' }}>
      <form className='card p-4 shadow-sm bg-dark text-light' style={{ width: 360 }} onSubmit={submit} aria-label='login form'>
        <h4 className='mb-3 text-center'>Login</h4>
        {error && <div className='alert alert-danger'>{error}</div>}
        
        <div className='form-floating mb-3'>
          <input
            type='email'
            className='form-control bg-dark text-light'
            id='email'
            placeholder='Enter your email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label htmlFor='email' className='text-light'>Email</label>
        </div>

        <div className='form-floating mb-3'>
          <input
            type='password'
            className='form-control bg-dark text-light'
            id='password'
            placeholder='Enter your password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <label htmlFor='password' className='text-light'>Password</label>
        </div>

        <button className='btn btn-primary w-100' type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className='mt-3 text-center'>
          Don't have an account? <Link to='/register' className='text-info'>Register</Link>
        </div>
      </form>
    </div>
  )
}
