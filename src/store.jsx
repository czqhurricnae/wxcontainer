import { createStore, combineReducers } from 'redux'
import formReducer from './pages/timesheet/reducer.jsx'
import userInfoReducer from './pages/authorize/reducer.jsx'

const reducer = combineReducers({
  timesheet: formReducer,
  userInfo: userInfoReducer
})

export default createStore(reducer, {})
