import { GET_USER_INFO, LOGOUT } from './actionTypes.jsx'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFO: {
      return (
        {
          ...action.userInfo
        }
      )
    }

    case LOGOUT: {
      return (
        {
          ...initialState

        }
      )
    }

    default: {
      return state
    }
  }
}
