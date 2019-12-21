import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import {
  AtForm,
  AtInput,
  AtButton,
  AtCard,
  AtInputNumber,
  AtNoticebar } from 'taro-ui'
import { ClSearchBar, ClRadio } from "mp-colorui"
import { connect } from '@tarojs/redux'
import _ from 'lodash'
import {
  deleteForm,
  stashForm,
  changeTask,
  changeCalculatedTime,
  clearDatasheets
} from '../actions.jsx'
import {
  tasksAPI,
  segmentationsAPI
}
from '@constants/api'
import DocsHeader from '../../doc-header/index.jsx'
import moment from 'moment'

import './entryForm.scss'

class EntryForm extends Taro.Component {
  static defaultProps = {
    onDelete: () => {},
    onStash: () => {},
    onChangeTask: () => {},
    onChangeCalculatedTime: () => {},
    formID: ''
  }

  constructor () {
    super (...arguments)

    this.state = {
      source: [],
      results: [],
      segmentations: [],
      airplane: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      task: '',
      tasktime: '',
      calculatedTime : '',
      // XXX: 工作者人数.
      workerNumber: 1,
      completed: '全部完成',
      open: false,
      isLoading: false,
      showNoticebar: false,
      stashDisabled: false
    }

    this.handleSearchChange = _.debounce(this.handleSearchChange, 500,
                                         {leading: true})
  }

  componentDidMount () {
    Taro.request({ url: tasksAPI, method: 'GET' })
      .then(res => {
        if (res.statusCode === 200) {
          this.setState({ source: res.data })
        }
      })
      .catch((error) => {
        console.log(error)

        this.setState({ showNoticebar: true })
      })
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

  handleCalculatedTimeChange = (calculatedTime) => {
    const formID = this.props.formID

    this.setState({
      calculatedTime: calculatedTime,
      stashDisabled: false
    })

    // XXX: 将变化的 calculatedTime 暂存到 store 中.
    this.props.onChangeCalculatedTime(formID, calculatedTime)

    return calculatedTime
  }

  handleSearchChange = (task) => {
    const formID = this.props.formID
    const kind = '其他'

    this.setState({ isLoading: true, task, stashDisabled: false })

    setTimeout(() => this.handleSegment(task))

    if (task === '') {
      setTimeout(() => {
        this.setState({
          isLoading: false,
          results: [],
          open: false,
          task: task
        }, this.props.onChangeTask(formID, task, kind))
      })

      return
    }

    setTimeout(() => {
      const isMatch = result => this.state.segmentations.every(
        (item, index, array) => {
          return new RegExp(item).test(result.title)
      })

      setTimeout(() => this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
        open: Boolean(task.length),
        task: task
      }, this.props.onChangeTask(formID, task, kind)), 500)

    }, 500)
  }

  handleSegment = (search) => {
    Taro.request({
      url: segmentationsAPI,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({ search })
    })
      .then(res => {
        if (res.statusCode === 200) {
          this.setState({
            segmentations: res.data.filter(
              (item, index, array) => (item.length > 1))
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleSelect = (index) => {
    const { results } = this.state
    const formID = this.props.formID
    const task = results[index].title
    const tasktime = results[index].tasktime
    const kind = results[index].kind
    const workerNumber = results[index].worker_number
    const rawCalculatedTime = Number(tasktime) / workerNumber
    const calculatedTime = rawCalculatedTime.toFixed(1)

    Taro.showToast({
      title: `您点击了 ${task} .`,
      icon: 'none'
    })

    this.setState({ open: false, task, tasktime, calculatedTime, workerNumber })
    this.props.onChangeTask(formID, task, kind)
    this.props.onChangeCalculatedTime(formID, calculatedTime)
  }

  handleFocus = () => {
    this.setState({open: false})
  }

  handleBlur = () => {
    this.setState({open: false})
  }

  handleIconClick = (index) => {
    this.setState({open: !this.state.open})
  }

  handleWorkerNumberChange = (workerNumber) => {
    const { formID } = this.props
    const tasktime = Number(this.state.tasktime)

    if (tasktime == 0) {
      Taro.showToast({
        title: '请先选择工作内容, 否则无法计算平均工时..',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      const calculatedTime = tasktime / workerNumber
      this.setState({ workerNumber, calculatedTime })
      this.props.onChangeCalculatedTime(formID, calculatedTime)
    }
  }

  handleRadioChange = (value) => {
    this.setState({ completed: value })
  }

  handleSubmit = (event) => {
    const { formID } = this.props
    const propsDatasheet = this.props.datasheets[formID] || {}
    console.log(propsDatasheet)
    const submitDatasheet = {
      date: this.state.date,
      airplane: this.state.airplane,
      completed: this.state.completed,
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
    if (!('task' in propsDatasheet) || !('calculatedTime' in propsDatasheet)) {
      Taro.showToast({
        title: '请输入工作或者工时, 再暂存.',
        icon: 'none',
        duration: 2000
      })

      return
    }

    // XXX: 当用户在进行有效输入后再进行重置后, store 中 task, calculatedTime都为空字符串.
    if ((propsDatasheet.task == '') || (propsDatasheet.calculatedTime== '')) {
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
      results: [],
      segmentations: [],
      airplane: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      task: '',
      tasktime: '',
      calculatedTime: '',
      workerNumber: 1,
      open: false,
      isLoading: false,
      stashDisabled: false,
      showNoticebar: false
    })

    this.forceUpdate()
  }

  handleDelete () {
    const { formID } = this.props

    Taro.atMessage({
      'message': '已经删除.',
      'type': 'warning'
    })
    this.props.onDelete(formID)
  }

  render () {
    const { formID } = this.props
    const {
      isLoading,
      open,
      results,
      task,
      calculatedTime,
      airplane,
      workerNumber,
      date,
      showNoticebar
    } = this.state

    return (
      <View className='page'>
        {showNoticebar ?
         <AtNoticebar icon='volume-plus'>
           从后台获取标准工时失败, 请手动输入工作项目和工时!
         </AtNoticebar>
         : ''}
        <View className='doc-body'>
          <View className='panel'>
            <View className='panel__content'>
              <View className='card'>
                <AtCard
                  title={String(formID)}
                  note='点击下方按钮来继续添加表单.'
                >
                  <AtForm className='form'
                    onSubmit={this.handleSubmit}
                    onReset={this.handleReset}
                  >
                    <View className='form__search-input-group'>
                      <ClSearchBar
                        color='lightblue'
                        placeholder='搜索你的工作项目'
                        showLoading={isLoading}
                        showResult={open}
                        result={results}
                        onInput={this.handleSearchChange}
                        onTouchResult={this.handleSelect}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        searchType={'none'}
                        leftIcons={ open ? ['fold'] : ['unfold']}
                        onIconClick={this.handleIconClick}
                      />
                      <View className='form__search-input-group__search-input-item'>
                        <View className='form__search-input-group__search-input-item__label'>
                          工作项目
                        </View>
                        <View className='form__search-input-group__search-input-item__value'>
                          {task}
                        </View>
                      </View>
                    </View>
                    <View className='form__input-group'>
                      <AtInput
                        name='calculatedTime'
                        title='工时'
                        type='text'
                        placeholder='自动填充'
                        value={calculatedTime}
                        onChange={this.handleCalculatedTimeChange}
                      />
                    </View>
                    <View className='form__input-group'>
                      <AtInput
                        name='airplane'
                        title='机号'
                        type='text'
                        placeholder='请输入机号'
                        value={airplane}
                        onChange={this.handleAirplaneChange}
                      />
                    </View>
                    <View className='form__input-number-group'>
                      <View className='form__input-number-group__input-number-item__label'>
                        工作人数
                      </View>
                      <AtInputNumber
                        min={1}
                        max={10}
                        step={1}
                        value={workerNumber}
                        onChange={this.handleWorkerNumberChange}
                      >
                      </AtInputNumber>
                      <ClRadio
                        type='normal'
                        radioGroup={[{key: '全部完成', value: '全部完成'}, { key: '部分完成', value: '部分完成' }]}
                        checkedValue='全部完成'
                        onChange={this.handleRadioChange}
                      >
                      </ClRadio>
                    </View>
                    <View className='form__picker-group'>
                      <Picker mode='date' value={date} onChange={this.handleDateChange}>
                        <View className='form__picker-group__picker-item'>
                          <View className='form__picker-group__picker-item__label'>请选择日期</View>
                          <View className='form__picker-group__picker-item__value'>
                            {date}
                          </View>
                        </View>
                      </Picker>
                    </View>
                    <View className='form__btn-group'>
                      <View className='form__btn-group__btn-item'>
                        <AtButton  size='small' onClick={this.handleDelete.bind(this)}>删除</AtButton>
                      </View>
                      <View className='form__btn-group__btn-item'>
                        <AtButton formType='reset' size='small'>重置</AtButton>
                      </View>
                      <View className='form__btn-group__btn-item'>
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
      datasheets: state.timesheets.datasheets
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
      },
      onChangeTask (formID, task, kind) {
        dispatch(changeTask(formID, task, kind))
      },
      onChangeCalculatedTime (formID, tasktime) {
        dispatch(changeCalculatedTime(formID, tasktime))
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm)
