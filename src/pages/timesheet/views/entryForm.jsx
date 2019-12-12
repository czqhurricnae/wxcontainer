import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtCard } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { deleteForm, stashForm } from '../actions.jsx'
import DocsHeader from '../../doc-header/index.jsx'
import SearchInput from './searchInput.jsx'
import moment from 'moment'

import './entryForm.scss'

class EntryForm extends Taro.Component {
  static defaultProps = {
    onDelete: () => {},
    onStash: () => {},
    formID: ''
  }

  constructor () {
    super (...arguments)
    this.state = {
      airplane: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      stashDisabled: false
    }
  }

  handleAirplaneChange = (value) => {
    this.setState({
      airplane: value,
      stashDisabled: false
    })

    return value
  }

  handleDateChange = (event) => {
    this.setState({
      date: event.detail.value,
      stashDisabled: false
    })
  }

  handleSubmit = (event) => {
    const formID = this.props.formID
    const propsDatasheet = this.props.datasheets[formID] || {}
    const submitDatasheet = {
      date: this.state.date,
      airplane: this.state.airplane,
      stashed: true
    }

    if (submitDatasheet.airplane == '') {
      Taro.showToast({
        title: '请输入机号, 再暂存.',
        icon: 'none',
        duration: 2000
      })

      return
    }

    // XXX: 当用户第一次没有输入任何工作时进行提示.
    if (!('task' in propsDatasheet) || !('tasktime' in propsDatasheet)) {
      Taro.showToast({
        title: '请输入工作或者工时, 再暂存.',
        icon: 'none',
        duration: 2000
      })

      return
    }

    // XXX: 当用户在进行有效输入后再进行重置后, store 中 task, tasktime 都为空字符串.
    if ((propsDatasheet.task == '') || (propsDatasheet.tasktime == '')) {
      Taro.showToast({
        title: '请输入工作或者工时, 再暂存.',
        icon: 'none',
        duration: 2000
      })

      return
    }

    this.props.onStash(formID, submitDatasheet)
    this.setState({stashDisabled: true})
  }

  handleReset = (event) => {
    this.setState({
      airplane: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      stashDisabled: false
    })
  }

  handleDelete () {
    const { formID } = this.props

    Taro.atMessage({
      'message': '已经删除.',
      'type': 'warning'
    })
    this.props.onDelete(formID)
  }

  // XXX: 让搜索输入框变化时, 暂存按钮也高亮, 传递给子组建 SearchInput 调用.
  handleTaskChange = () => {
    this.setState({stashDisabled: false})
  }

  render () {
    const { formID } = this.props

    return (
      <View className='page'>
        <View className='doc-body'>
          <View className='panel'>
            <View className='panel__content'>
              <View className='component-item'>
                <AtCard
                  title={String(formID)}
                  note='点击下方按钮来继续添加表单.'
                >
                  <AtForm className='component-item__form-group'
                    onSubmit={this.handleSubmit}
                    onReset={this.handleReset}
                  >
                    <SearchInput
                      formID={this.props.formID}
                      onTaskChange={this.handleTaskChange}
                    >
                    </SearchInput>

                    <View className='component-item__input-group'>
                      <AtInput
                        name='airplane'
                        title='机号'
                        type='text'
                        placeholder='请输入机号'
                        value={this.state.airplane}
                        onChange={this.handleAirplaneChange}
                      />
                    </View>

                    <View className='component-item__picker-group'>
                      <Picker mode='date' value={this.state.date} onChange={this.handleDateChange}>
                        <View className='component-item__picker-group__picker-item'>
                          <View className='component-item__picker-group__picker-item__label'>请选择日期</View>
                          <View className='component-item__picker-group__picker-item__value'>
                            {this.state.date}
                          </View>
                        </View>
                      </Picker>
                    </View>

                    <View className='component-item__btn-group'>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton  size='small' onClick={this.handleDelete.bind(this)}>删除</AtButton>
                      </View>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton formType='reset' size='small'>重置</AtButton>
                      </View>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton type='primary' formType='submit' size='normal' disabled ={this.state.stashDisabled}>暂存</AtButton>
                      </View>
                    </View>
                  </AtForm>
                </AtCard>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return (
    {
      datasheets: state.timesheet.datasheets
    }
  )
}

const mapDispatchToProps = (dispatch) => {
  return (
    {
      onDelete (formID) {
        dispatch(deleteForm(formID))
      },
      onStash (formID, datasheet) {
        dispatch(stashForm(formID, datasheet))
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm)
