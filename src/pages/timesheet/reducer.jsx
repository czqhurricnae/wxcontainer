import { ADD_ENTRY_FORM, DELETE_FORM, STASH_FORM, SELECT_SEARCH, CHANGE_TASK, CHANGE_TASKTIME } from './actionTypes.jsx'

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

    case SELECT_SEARCH: {
      const formID = action.formID
      const task = action.task
      const tasktime = action.tasktime
      const kind = action.kind
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...obj[formID], task, tasktime, kind }

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

    case CHANGE_TASKTIME: {
      const formID = action.formID
      const tasktime = action.tasktime
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...obj[formID], tasktime }

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
