import axios from 'axios'
import { clearAuthAndRedirect } from '../utils/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('hospital_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(response=>response, error=>{
  if (error.response && error.response.status === 401){
    clearAuthAndRedirect()
  }
  return Promise.reject(error)
})

export default api
