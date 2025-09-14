import React, { useEffect, useState } from 'react'
import api from '../api/axios'

function DataTable({ data, search, statusFilter, sortOrder }) {
  const [page, setPage] = useState(1)
  const per = 3

  // Filter by search and status
  const filtered = data
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .filter(d => statusFilter === 'All' || d.status.toLowerCase() === statusFilter.toLowerCase())

  // Sort by appointment date
  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.date)
    const db = new Date(b.date)
    return sortOrder === 'asc' ? da - db : db - da
  })

  const total = Math.ceil(sorted.length / per)
  const slice = sorted.slice((page - 1) * per, page * per)

  // Status badge color
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-warning text-dark'
      case 'completed': return 'bg-success text-white'
      case 'cancelled': return 'bg-secondary text-white'
      default: return 'bg-dark text-white'
    }
  }

  return (
    <div>
      <div className='row'>
        {slice.map(p => {
          const d = new Date(p.date)
          const date = d.toLocaleDateString()
          const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
          return (
            <div key={p._id} className='col-md-4'>
              <div
                className='card mb-3 p-3 shadow-sm border-primary'
                style={{
                  borderRadius: '1rem',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bs-body-bg)',
                  color: 'var(--bs-body-color)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)'
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <h6 className='fw-bold'>{p.name}</h6>
                <p>Email: {p.email}</p>
                <p>Phone: {p.phone}</p>
                <p>Date: {date}</p>
                <p>Time: {time}</p>
                <p><strong>Reason:</strong> {p.reason || 'N/A'}</p>
                <span className={`badge ${getStatusBadge(p.status)}`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className='d-flex justify-content-between align-items-center mt-2'>
        <small>Page {page} / {total || 1}</small>
        <div>
          <button
            className='btn btn-sm btn-outline-primary me-2'
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className='btn btn-sm btn-outline-primary'
            onClick={() => setPage(p => Math.min(total || 1, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('asc')
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('hospital_user'))

  useEffect(() => { fetchPatients() }, [])

  const fetchPatients = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await api.get('/api/appointments')
      let appointments = res.data

      // Admin sees all, doctor sees only their appointments
      if (user.role === 'doctor') {
        appointments = appointments.filter(a => a.doctor?._id === user._id)
      }

      // Map patients with appointment info
      const uniquePatientsMap = {}
      appointments.forEach(a => {
        if (a.patient?._id) {
          uniquePatientsMap[a.patient._id] = {
            _id: a.patient._id,
            name: a.patient.name,
            email: a.patient.email,
            phone: a.patient.phone,
            status: a.status,
            date: a.date,
            reason: a.reason
          }
        }
      })
      setPatients(Object.values(uniquePatientsMap))
    } catch (e) {
      console.error(e)
      alert('Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4>Patients</h4>

      {/* Controls */}
      <div className='mb-3 d-flex flex-wrap gap-2 align-items-center'>
        <input
          className='form-control me-2 w-auto'
          placeholder='Search by name'
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            backgroundColor: 'var(--bs-body-bg)',
            color: 'var(--bs-body-color)',
            borderColor: '#0d6efd'
          }}
        />
        <select
          className='form-select form-select-sm w-auto'
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)', borderColor: '#0d6efd' }}
        >
          <option>All</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select
          className='form-select form-select-sm w-auto'
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          style={{ backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)', borderColor: '#0d6efd' }}
        >
          <option value="asc">Date & Time ↑</option>
          <option value="desc">Date & Time ↓</option>
        </select>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className='p-3'>Loading...</div>
      ) : (
        <DataTable data={patients} search={search} statusFilter={statusFilter} sortOrder={sortOrder} />
      )}
    </div>
  )
}
