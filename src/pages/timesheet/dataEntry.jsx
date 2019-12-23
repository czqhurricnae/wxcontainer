import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View } from '@tarojs/components'
import { AtButton, AtMessage, AtNoticebar } from 'taro-ui'
import DocsHeader from '../doc-header/index.jsx'
import EntryForm from './views/entryForm.jsx'
import { addEntryForm, clearAllTimesheets, deleleAllForms } from './actions.jsx'
import store from '../../store.jsx'
import { timesheetsAPI } from '@constants/api'

import './dataEntry.scss'

class DataEntry extends Taro.Component {
  static defaultProps = {
    onAddEntryForm: () => {},
    onClearDatasheets: () => {},
    onDeleleAllForms: () => {}
  }

  constructor (props) {
    super(...arguments)
    const { formList } = this.props

    this.state = {
      formList,
      disableSubmit: false,
      showNoticebar: false
    }
  }

  componentDidMount () {
    const userInfo = Taro.getStorageSync('userInfo')
    const number = userInfo && userInfo.number

    store.subscribe(() => this._updateFormList())

    if (!userInfo || !number) {
      this.setState({
        disableSubmit: true,
        showNoticebar: true
      })
    }
  }

  componentWillUnmount () {
    // XXX: 清除 store 中所有的表单的数据.
    this.props.onClearDatasheets()
  }

  handleAddEntryForm = () => {
    this.props.onAddEntryForm()
  }

  _updateFormList = () => {
    const { formList } = this.props

    this.setState({ formList })
  }

  handleSubmit = () => {
    const state = store.getState()
    const datasheets  = state.timesheets.datasheets
    const formIDArray = Object.keys(datasheets)
    const newData = {}
    // XXX: timesheets 用来存放推送的工时对象的数组.
    const timesheets = new Array()

    if (formIDArray.length !== 0) {
      // XXX: 检查 store 中所有的 timesheet 都已经被暂存, 避免出现用户点击重置后
      // 却还可以提交的情况.
      for (let item of Object.values(datasheets)) {
        if (item.stashed === undefined) {
          // XXX: 没有 stashed 字段说明没有暂存.
          Taro.atMessage({
            'message': '请确保先暂存再提交!',
            'type': 'warning'
          })

          return
        }
        else {
          if (newData[item.stashed] === undefined) {
            // newData[item.stashed] = []
            newData[item.stashed] = new Array()
          }
          // newData[item.stashed].splice(newData[item.stashed].length, 0, item.formID)
          newData[item.stashed].push(item.formID)
        }
      }

      if (newData['false'] && newData['false'].length > 0) {
        Taro.atMessage({
          'message': '请确保先暂存再提交!',
          'type': 'warning'
        })

        return
      }

      formIDArray.map((item, index, array) => {
        const timesheet = datasheets[item]
        const userInfo = Taro.getStorageSync('userInfo')
        const name = userInfo.nickName
        const number = userInfo.number
        // XXX: belongto_team 用户所属班组的 id.
        const belongto_team = userInfo.belongto_team

        timesheets.push({...timesheet, name: name, number: number, belongto_team: belongto_team})
      })

      console.log('dataEntry.jsx -> DataEntry.handleSubmit -> 108 -> timesheets', timesheets)

      Taro.request({
        url: timesheetsAPI,
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        data: JSON.stringify({timesheets: timesheets})
      })
        .then(res => {
          if (res.statusCode === 201) {
            Taro.showToast({
              title: `提交 ${res.data.count} 个工时成功.`,
              icon: 'none',
              duration: 2000
            })

            this.props.onDeleleAllForms()
          }
          else {
            console.log(res.statusCode, res.data.message)

            Taro.atMessage({
              'message': `提交时出现错误,错误信息为 ${res.data.message}!`,
              'type': 'warning'
            })
          }
        })
        .catch((error) => {
          console.log(error)

          Taro.atMessage({
            'message': `提交时出现错误, 错误信息为: ${error.errMsg}!`,
            'type': 'warning'
          })
        })
    }
    // XXX: 一个暂存都没有.
    else {
      Taro.atMessage({
        'message': '请确保先暂存再提交!',
        'type': 'warning'
      })

      return
    }
  }

  render () {
    const { formList, disableSubmit, showNoticebar } = this.state

    const children = formList.map((item, index, formIDArrayay) => {
      return (<EntryForm formID={item}></EntryForm>)
    })

    return (
      <View className='page flex-page' >
        <AtMessage></AtMessage>
        {showNoticebar ?
         <AtNoticebar icon='volume-plus'>
           您没有登录, 或者没有绑定工号, 无法进行工时提交, 请到帐号管理绑定!
         </AtNoticebar>
         : ''}
        <DocsHeader title='工时录入' />
        <View>
          {children}
          <View className='at-row'>
            <AtButton
              className='dataEntry__addButton at-col at-col-11'
              type='secondary'
              onClick={this.handleAddEntryForm}>
                增加表格
            </AtButton>
            <AtButton
              className='dataEntry__submitButton at-col at-col-11'
              type='primary'
              onClick={this.handleSubmit}
              disabled={disableSubmit}>
              全部提交
            </AtButton>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return (
    {
      formList: state.timesheets.formList,
      datasheets: state.timesheets.datasheets
    }
  )
}

const mapDispatchToProps = (dispatch) => {
  return (
    {
      onAddEntryForm () {
          dispatch(addEntryForm())
        },
      onClearDatasheets () {
        dispatch(clearAllTimesheets())
      },
      onDeleleAllForms () {
        dispatch(deleleAllForms())
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DataEntry)
