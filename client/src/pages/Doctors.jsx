import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDoctors() }, [])

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/doctors')
      setDoctors(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4 className="mb-3">Doctors</h4>
      {loading ? <div>Loading...</div> : (
        <div className="row g-3">
          {doctors.map(d => (
            <div key={d._id} className="col-md-4">
              <div className="card doctor-card p-3 shadow-sm hover-card h-100">
                <div className="card-body text-center">
                  <div className="avatar mb-3">{d.name.charAt(0).toUpperCase()}</div>
                  <h5 className="card-title">Name : {d.name}</h5>
                  <p className="card-text">Specialization : {d.specialization}</p>
                  <p className="card-text">Ph.No : {d.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS Styling */}
      <style>{`
        /* Card animation and theme adaptation */
        .doctor-card {
          border-radius: 1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          background-color: var(--bs-body-bg);
          color: var(--bs-body-color);
        }

        .doctor-card:hover {
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          transition: background 0.3s ease;
        }

        .doctor-card:hover .avatar {
          background: linear-gradient(135deg, #43e97b, #38f9d7);
        }

        /* Dark theme support using prefers-color-scheme */
        @media (prefers-color-scheme: dark) {
          .doctor-card {
            background-color: #1e1e2f;
            color: #f1f1f1;
          }
          .doctor-card:hover {
            box-shadow: 0 10px 20px rgba(255,255,255,0.1);
          }
        }
      `}</style>
    </div>
  )
}
