import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export default function Navbar({ theme, setTheme, user, onLogout }) {
  return (
    <nav className={`navbar navbar-expand-lg px-3 ${theme === 'light' ? 'navbar-light bg-light' : 'navbar-dark bg-dark'}`}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">HospitalSys</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                {/* Dashboard: visible to all */}
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                  >
                    Dashboard
                  </NavLink>
                </li>

                {/* Admin links */}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/patients"
                        className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                      >
                        Patients
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/doctors"
                        className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                      >
                        Doctors
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/appointments"
                        className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                      >
                        Appointments
                      </NavLink>
                    </li>
                  </>
                )}

                {/* Doctor links */}
                {user.role === 'doctor' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/patients"
                        className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                      >
                        Patients
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/appointments"
                        className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                      >
                        Appointments
                      </NavLink>
                    </li>
                  </>
                )}

                {/* Patient links */}
                {user.role === 'patient' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/doctors"
                        className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                      >
                        Doctors
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/appointments"
                        className={({ isActive }) => `nav-link ${isActive ? 'fw-bold active' : ''}`}
                      >
                        Appointments
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {/* Theme toggle */}
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </button>

            {/* User actions */}
            {user ? (
              <div className="d-flex align-items-center">
                <div className="me-3">{user.name}</div>
                <button className="btn btn-danger btn-sm" onClick={onLogout}>Logout</button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-primary btn-sm me-2">Login</Link>
                <Link to="/register" className="btn btn-outline-primary btn-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
