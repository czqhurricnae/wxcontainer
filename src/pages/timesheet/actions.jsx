import {
  ADD_ENTRY_FORM,
  DELETE_ENTRY_FORM,
  STASH_ENTRY_FORM,
  RESET_ENTRY_FROM,
  CHANGE_TASK,
  CHANGE_CALCULATEDTIME,
  CHANGE_AIRPLANE,
  CHANGE_COMPLETED,
  CHANGE_DATE,
  CHANGE_STASHED,
  CLEAR_ALL_TIMESHEETS,
  DELETE_ALL_FORMS } from './actionTypes.jsx'

export const addEntryForm = () => ({
  type: ADD_ENTRY_FORM
})

export const deleteForm = (formID) => ({
  type: DELETE_ENTRY_FORM,
  formID: formID
})

export const stashForm = (formID, datasheet) => ({
  type: STASH_ENTRY_FORM,
  formID: formID,
  datasheet: datasheet
})

export const resetForm = (formID) => ({
  type: RESET_ENTRY_FROM,
  formID: formID
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

export const changeCompleted = (formID, completed) => ({
  type: CHANGE_COMPLETED,
  formID: formID,
  completed: completed
})

export const changeDate = (formID, date) => ({
  type: CHANGE_DATE,
  formID: formID,
  date: date
})

export const changeStashed = (formID, stashed) => ({
  type: CHANGE_STASHED,
  formID: formID,
  stashed: stashed
})

export const clearAllTimesheets = () => ({
  type: CLEAR_ALL_TIMESHEETS
})

export const deleleAllForms = () => ({
  type: DELETE_ALL_FORMS
})
