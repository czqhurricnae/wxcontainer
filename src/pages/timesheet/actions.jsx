import { ADD_ENTRY_FORM, DELETE_FORM, STASH_FORM, CHANGE_TASK, CHANGE_CALCULATEDTIME } from './actionTypes.jsx'

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

export const changeTask = (formID, task, kind) => ({
  type: CHANGE_TASK,
  formID: formID,
  task: task,
  kind: kind
})

export const changeCalculatedTime = (formID, calculatedTime) => ({
  type: CHANGE_CALCULATEDTIME,
  formID: formID,
  calculatedTime: calculatedTime
})
