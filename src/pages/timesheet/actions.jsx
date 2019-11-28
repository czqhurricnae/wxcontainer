import { ADD_ENTRY_FORM, DELETE_FORM, STASH_FORM } from './actionTypes.jsx'

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