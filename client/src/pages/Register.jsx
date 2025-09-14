import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    specialization: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      await api.post('/api/auth/register', form)
      setMsg('Registered! Please login.')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      setMsg(err.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <form className="card p-4 shadow-sm bg-dark text-light" style={{ width: 420 }} onSubmit={submit}>
        <h4 className="mb-3 text-center">Register</h4>
        {msg && <div className="alert alert-info">{msg}</div>}

        <div className="row g-2">
          <div className="col-12 form-floating mb-2">
            <input 
              name="name" 
              className="form-control bg-dark text-light" 
              placeholder="Name" 
              value={form.name} 
              onChange={handle} 
              required 
            />
            <label className="text-light">Name</label>
          </div>
          <div className="col-12 form-floating mb-2">
            <input 
              name="email" 
              className="form-control bg-dark text-light" 
              placeholder="Email" 
              value={form.email} 
              onChange={handle} 
              required 
            />
            <label className="text-light">Email</label>
          </div>
          <div className="col-12 form-floating mb-2">
            <input 
              name="password" 
              type="password" 
              className="form-control bg-dark text-light" 
              placeholder="Password" 
              value={form.password} 
              onChange={handle} 
              required 
            />
            <label className="text-light">Password</label>
          </div>
          <div className="col-6 form-floating mb-2">
            <select 
              name="role" 
              className="form-select bg-dark text-light" 
              value={form.role} 
              onChange={handle}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            <label className="text-light">Role</label>
          </div>
          <div className="col-6 form-floating mb-2">
            <input 
              name="phone" 
              className="form-control bg-dark text-light" 
              placeholder="Phone" 
              value={form.phone} 
              onChange={handle} 
            />
            <label className="text-light">Phone</label>
          </div>
          <div className="col-12 form-floating mb-2">
            <input 
              name="address" 
              className="form-control bg-dark text-light" 
              placeholder="Address" 
              value={form.address} 
              onChange={handle} 
            />
            <label className="text-light">Address</label>
          </div>
          <div className="col-6 form-floating mb-2">
            <input 
              name="dob" 
              type="date" 
              className="form-control bg-dark text-light" 
              placeholder="DOB" 
              value={form.dob} 
              onChange={handle} 
            />
            <label className="text-light">DOB</label>
          </div>
          <div className="col-6 form-floating mb-2">
            <select 
              name="gender" 
              className="form-select bg-dark text-light" 
              value={form.gender} 
              onChange={handle}
            >
              <option value="">Choose</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label className="text-light">Gender</label>
          </div>
        </div>

        <button className="btn btn-success mt-2 w-100" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="mt-3 text-center">
          Already have an account? <Link to="/login" className="text-info">Login</Link>
        </div>
      </form>
    </div>
  )
}
