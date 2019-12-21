import {
  ADD_ENTRY_FORM,
  DELETE_FORM,
  STASH_FORM,
  CHANGE_TASK,
  CHANGE_CALCULATEDTIME,
  CHANGE_AIRPLANE,
  CHANGE_COMPLETED,
  CHANGE_DATE,
  CLEAR_DATASHEETS } from './actionTypes.jsx'

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

export const changeAirplane = (formID, airplane) => ({
  type: CHANGE_AIRPLANE,
  formID: formID,
  airplane: airplane
})

export const changeCompleted = (formID, completed) => (
  {
    type: CHANGE_COMPLETED,
    formID: formID,
    completed: completed
  }
)

export const changeDate = (formID, date) => (
  {
    type: CHANGE_DATE,
    formID: formID,
    date: date
  }
)

export const clearDatasheets = () => ({
  tyep: CLEAR_DATASHEETS
})
