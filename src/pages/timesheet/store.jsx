import { createStore, applyMiddleware } from 'redux'

import formReducer from './reducer.jsx'

export default createStore(formReducer)
