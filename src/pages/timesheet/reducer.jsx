import { ADD_ENTRY_FORM, DELETE_FORM, STASH_FORM, CHANGE_TASK, CHANGE_CALCULATEDTIME } from './actionTypes.jsx'

export default (state = { datasheets: {}, formList: [1, 2] }, action) => {
  switch (action.type) {
    case ADD_ENTRY_FORM: {
      return (
        {
          formList: [...state.formList, Number(state.formList.slice(-1)) + 1],
          datasheets: JSON.parse(JSON.stringify(state.datasheets))
        }
      )
    }

    case DELETE_FORM: {
      const formID = action.formID
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      delete obj[formID]

      return (
        {
          formList: state.formList.filter(t => t !== action.formID),
          datasheets: obj
        }
      )
    }

    case STASH_FORM: {
      const formID = action.formID
      const datasheet = action.datasheet
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...datasheet, ...obj[formID] }

      return (
        {
          formList: [...state.formList],
          datasheets: obj
        }
      )
    }

    case CHANGE_TASK: {
      const formID = action.formID
      const task = action.task
      const kind = action.kind
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...obj[formID], task, kind }

      return (
        {
          formList: [...state.formList],
          datasheets: obj
        }
      )
    }

    case CHANGE_CALCULATEDTIME: {
      const formID = action.formID
      const calculatedTime = action.calculatedTime
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...obj[formID], calculatedTime }

      return (
        {
          formList: [...state.formList],
          datasheets: obj
        }
      )
    }

    default: {
      return state
    }
  }
}
