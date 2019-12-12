import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View } from '@tarojs/components'
import { AtButton, AtMessage, AtNoticebar } from 'taro-ui'
import DocsHeader from '../doc-header/index.jsx'
import EntryForm from './views/entryForm.jsx'
import { addEntryForm } from './actions.jsx'
import store from '../../store.jsx'
import { timesheetAPI } from '@constants/api'

import './dataEntry.scss'

class DataEntry extends Taro.Component {
  static defaultProps = {
    onAddEntryForm: () => {}
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

  handleAddEntryForm = () => {
    this.props.onAddEntryForm()
  }

  _updateFormList = () => {
    const { formList } = this.props
    this.setState({ formList })
  }

  handleSubmit = () => {
    const state = store.getState()
    const datasheets  = state.timesheet.datasheets
    const formIDArray = Object.keys(datasheets)
    const timesheets = new Array()

    if (formIDArray.length !== 0) {
      formIDArray.map((item, index, array) => {
        const timesheet = datasheets[item]
        const userInfo = Taro.getStorageSync('userInfo')
        const name = userInfo.nickName
        const number = userInfo.number
        const belongto_team = userInfo.belongto_team

        timesheets.push({...timesheet, name: name, number: number, belongto_team: belongto_team})
      })

      Taro.request({
        url: timesheetAPI,
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        data: JSON.stringify({timesheets: timesheets})
      })
        .then(res => {
          if (res.statusCode === 200) {
            Taro.showToast({
              title: '工时提交成功.',
              icon: 'none',
              duration: 2000
            })
          }
          else {
            Taro.atMessage({
              'message': '提交时出现错误!',
              'type': 'warning',
            })
          }
        })
        .catch((error) => {
          Taro.atMessage({
            'message': `提交时出现错误, 错误信息为: ${error.errMsg}!`,
            'type': 'warning',
          })
        })
    }
    // XXX: 一个暂存都没有.
    else {
      Taro.atMessage({
        'message': '请确保先暂存再提交!',
        'type': 'warning'
      })
    }
  }

  _checkTimesheet = (formID, timesheet) => {


  }

  render () {
    const { formList } = this.state

    const children = formList.map((item, index, formIDArrayay) => {
      return (<EntryForm formID={item}></EntryForm>)
    })

    return (
      <View className='page flex-page' >
        <AtMessage></AtMessage>
        {this.state.showNoticebar ?
         <AtNoticebar icon='volume-plus'>
           您没有登录, 或者后台没有您对应的工号, 无法进行工时提交!
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
              disabled={this.state.disableSubmit}>
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
      formList: state.timesheet.formList,
      datasheets: state.timesheet.datasheets
    }
  )
}

const mapDispatchToProps = (dispatch) => {
  return (
    {
        onAddEntryForm () {
          dispatch(addEntryForm())
        }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DataEntry)
