import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function CreateAppointment() {
  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchDoctors() }, [])

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/api/doctors')
      setDoctors(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!doctorId || !date || !time) {
      alert('Select doctor, date, and time')
      return
    }
    if (reason.length > 40) {
      alert('Reason cannot exceed 40 characters')
      return
    }
    const datetime = new Date(date + 'T' + time + ':00Z').toISOString()
    setLoading(true)
    try {
      await api.post('/api/appointments', { doctorId, date: datetime, reason })
      alert('Appointment created')
      navigate('/appointments')
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <div style={{ maxWidth: 620, width: '100%' }}>
        <h4 className="text-center mb-3">Create Appointment</h4>
        <form onSubmit={submit} className='card p-3 shadow-sm'>
          <div className='mb-2 form-floating'>
            <select className='form-select' value={doctorId} onChange={e => setDoctorId(e.target.value)}>
              <option value=''>Select doctor</option>
              {doctors.map(d =>
                <option key={d._id} value={d._id}>{d.name} - {d.specialization}</option>
              )}
            </select>
            <label>Doctor</label>
          </div>

          <div className='row g-2 mb-2'>
            <div className='col-6 form-floating'>
              <input type='date' className='form-control' value={date} onChange={e => setDate(e.target.value)} />
              <label>Date</label>
            </div>
            <div className='col-6 form-floating'>
              <input type='time' className='form-control' value={time} onChange={e => setTime(e.target.value)} />
              <label>Time</label>
            </div>
          </div>

          <div className='form-floating mb-2'>
            <textarea
              className='form-control'
              style={{ height: 100 }}
              value={reason}
              maxLength={40}
              onChange={e => setReason(e.target.value)}
            ></textarea>
            <label>Reason</label>
            <div className='form-text'>{reason.length}/40 characters</div>
          </div>

          <button className='btn btn-primary w-100' type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}
