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

const initialState = { datasheets: {}, formList: [1, 2] }

export default (state = initialState, action) => {
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

      // FIXME: 此处有个 bug, 已经修复.
      // XXX: 对于展开运算符, 后者会覆盖前者
      // obj[formID] = { ...datasheet, ...obj[formID] }
      // 这样的写法会导致原来的表单的数据会覆盖我们新的数据,
      // 具体表现就是用户新提交的 date, airplane, completed, stashed 字段都被
      // 旧数据覆盖.

      obj[formID] = { ...obj[formID], ...datasheet }

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

    case CHANGE_AIRPLANE: {
      const formID = action.formID
      const airplane = action.airplane
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...obj[formID], airplane }

      return (
        {
          formList: [...state.formList],
          datasheets: obj
        }
      )
    }

    case CHANGE_COMPLETED: {
      const formID = action.formID
      const completed = action.completed
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...obj[formID], completed }

      return (
        {
          formList: [...state.formList],
          datasheets: obj
        }
      )
    }

    case CHANGE_DATE: {
      const formID = action.formID
      const date = action.date
      const obj = JSON.parse(JSON.stringify(state.datasheets))

      obj[formID] = { ...obj[formID], date }

      return (
        {
          formList: [...state.formList],
          datasheets: obj
        }
      )
    }

    case CLEAR_DATASHEETS: {
      return (
        {
          ...initialState
        }
      )
    }

    default: {
      return state
    }
  }
}
