# Hospital Patient Record System (Backend)

## Features
- JWT authentication (roles: admin, doctor, patient)
- CRUD for Users (patients & doctors) and Appointments
- Role-based route protection (example middleware)
- Doctor availability enforcement (no two scheduled appointments at same datetime)
- MongoDB + Mongoose

## Setup (local)
1. Install Node.js (v18+ recommended) and MongoDB or use MongoDB Atlas.
2. Unzip project and open terminal in project folder.
3. Copy `.env.example` to `.env` and fill values.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. API will run on `http://localhost:5000` by default.

## Notes
- This is a backend template. You can extend models, validations, and add frontend.
- Use Postman to test endpoints. Login returns a JWT token to send in `Authorization: Bearer <token>` header.

## Endpoints (high level)
- `POST /api/auth/register` - register user (role: admin/doctor/patient)
- `POST /api/auth/login` - login (returns token)
- `GET /api/patients` - list patients (admin only)
- `POST /api/patients` - create patient (admin only)
- `GET /api/doctors` - list doctors (protected)
- `POST /api/doctors` - create doctor (admin only)
- `POST /api/appointments` - create appointment (patient or admin)
- `GET /api/appointments` - list appointments (filtered by role)
- `PUT /api/appointments/:id/status` - update status (admin only)

## Role & Booking Rules
- Roles: admin, doctor, patient.
- Login returns a JWT token only.
- Patients must book appointments themselves (or admin can create on behalf).
- No doctor can have more than one SCHEDULED appointment at the same exact date/time. The API enforces uniqueness using a compound index.
- Only admin can update appointment status.
