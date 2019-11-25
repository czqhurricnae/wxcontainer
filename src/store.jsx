import { createStore, combineReducers } from 'redux'
import formReducer from './pages/timesheet/reducer.jsx'

const reducer = combineReducers({
  timesheet: formReducer
})

export default createStore(reducer, {})
