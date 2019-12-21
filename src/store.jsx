import { createStore, combineReducers } from 'redux'
import timesheetsReducer from './pages/timesheet/reducer.jsx'
import userInfoReducer from './pages/authorize/reducer.jsx'

const reducer = combineReducers({
  timesheets: timesheetsReducer,
  userInfo: userInfoReducer
})

export default createStore(reducer, {})
