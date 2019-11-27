import { GET_USER_INFO, LOGOUT } from './actionTypes.jsx'

export const getUserInfo = (userInfo) => ({
  type: GET_USER_INFO,
  userInfo: userInfo
})

export const logout = () => ({
  type: LOGOUT
})
