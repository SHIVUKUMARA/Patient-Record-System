# Patient Record System

A **full-stack MERN (MongoDB, Express.js, React.js, Node.js) application** designed to manage patient records efficiently. This system allows for secure user authentication, and provides functionalities to add, update, view, and delete patient data. The project includes a responsive React frontend, a RESTful API backend, and is fully tested using Postman.

---

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **CRUD Operations**: Create, read, update, and delete patient records.
- **Role-based Access**: Admin and regular user access control.
- **Responsive UI**: Built with React for a seamless user experience.
- **RESTful API**: Developed using Node.js and Express.js.
- **Database**: MongoDB for storing patient records.
- **API Testing**: All endpoints tested with Postman.
- **Environment Configuration**: Support for `.env` files for API keys and DB URIs.
- **Error Handling**: Proper server-side validation and error messages.

---

## Technologies Used

- **Frontend**: React.js, HTML, CSS, Axios  
- **Backend**: Node.js, Express.js, JWT Authentication  
- **Database**: MongoDB (Mongo Atlas or local)  
- **Tools**: Postman (for API testing), Git, GitHub  

---

## Getting Started

### **Prerequisites**

- Node.js installed
- MongoDB (local or Atlas)
- npm or yarn

### **Setup Backend**

```bash
cd server
npm install
# create .env file with MONGO_URI and JWT_SECRET
npm start
```

### **Setup Frontend**

```bash
cd client
npm install
npm start
```

API Documentation

All endpoints have been tested in Postman. You can view the interactive documentation here:

👉 [Patient Record System API Documentation](https://documenter.getpostman.com/view/30794754/2sB3HqGJ9e)

This documentation includes:

- Endpoint descriptions
- Request and response examples
- Sample code snippets
- Authorization details

Environment Variables (.env)

```bash
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

License
This project is open-source and free to use.

Author
# ShivuKumara
