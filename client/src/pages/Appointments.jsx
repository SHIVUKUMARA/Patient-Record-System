import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

export default function Appointments() {
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('asc')
  const [updating, setUpdating] = useState(null)

  // ✅ get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('hospital_user'))

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/appointments')
      setAppts(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    setUpdating(id)

    // Convert to uppercase to match backend
    const formattedStatus = newStatus.toUpperCase()

    // ✅ optimistic UI update
    const prevAppts = [...appts]
    setAppts(appts.map(a => (a._id === id ? { ...a, status: formattedStatus } : a)))

    try {
      await api.put(`/api/appointments/${id}/status`, { status: formattedStatus })
    } catch (e) {
      console.error(e)
      alert('Failed to update status')
      // ❌ rollback if API fails
      setAppts(prevAppts)
    } finally {
      setUpdating(null)
    }
  }

  // Apply filter
  const filtered = statusFilter === 'All'
    ? appts
    : appts.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase())

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.date)
    const db = new Date(b.date)
    return sortOrder === 'asc' ? da - db : db - da
  })

  // Status badge color
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-danger'
      case 'completed': return 'bg-success'
      case 'cancelled': return 'bg-secondary'
      default: return 'bg-dark'
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Appointments</h4>
        {user?.role === 'patient' && (
          <Link to="/appointments/create" className="btn btn-primary btn-sm">Create</Link>
        )}
      </div>

      {/* Controls */}
      <div className="my-3 d-flex flex-wrap align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0">Filter:</label>
          <select
            className="form-select form-select-sm w-auto"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="mb-0">Sort by:</label>
          <select
            className="form-select form-select-sm w-auto"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="asc">Date & Time ↑</option>
            <option value="desc">Date & Time ↓</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle table-bordered theme-table">
            <thead>
              <tr>
                <th>Sl.no</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                {user?.role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {sorted.length > 0 ? sorted.map((a, idx) => {
                const d = new Date(a.date)
                const date = d.toLocaleDateString()
                const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                return (
                  <tr key={a._id}>
                    <td>{idx + 1}</td>
                    <td>{a.patient?.name}</td>
                    <td>{a.doctor?.name}</td>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(a.status)}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={a.status}
                          disabled={updating === a._id}
                          onChange={e => updateStatus(a._id, e.target.value)}
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    )}
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 7 : 6} className="text-center">No appointments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
