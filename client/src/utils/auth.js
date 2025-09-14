export const saveAuth = (token, user)=>{
  localStorage.setItem('hospital_token', token)
  localStorage.setItem('hospital_user', JSON.stringify(user))
}

export const getUserFromStorage = ()=>{
  try { return JSON.parse(localStorage.getItem('hospital_user')) } catch { return null }
}

export const clearAuthAndRedirect = ()=>{
  localStorage.removeItem('hospital_token')
  localStorage.removeItem('hospital_user')
  window.location.href = '/login'
}
