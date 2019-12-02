import { ADD_ENTRY_FORM, DELETE_FORM, STASH_FORM, SELECT_SEARCH, CHANGE_TASK, CHANGE_TASKTIME } from './actionTypes.jsx'

export const addEntryForm = () => ({
  type: ADD_ENTRY_FORM
})

export const deleteForm = (formID) => ({
  type: DELETE_FORM,
  formID: formID
})

export const stashForm = (formID, datasheet) => ({
  type: STASH_FORM,
  formID: formID,
  datasheet: datasheet
})

export const selectSearch = (formID, task, time) => ({
  type: SELECT_SEARCH,
  formID: formID,
  task: task,
  time: time
})

export const changeTask = (formID, task) => ({
  type: CHANGE_TASK,
  formID: formID,
  task: task
})

export const changeTasktime = (formID, taskTime) => ({
  type: CHANGE_TASKTIME,
  formID: formID,
  taskTime: taskTime
})
