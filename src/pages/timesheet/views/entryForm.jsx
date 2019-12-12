import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtCard } from 'taro-ui'
import { ClSearchBar } from "mp-colorui"
import { connect } from '@tarojs/redux'
import _ from 'lodash'
import {
  deleteForm,
  stashForm,
  selectSearch,
  changeTask,
  changeTasktime
} from '../actions.jsx'
import {
  tasksAPI,
  segmentationsAPI,
}
from '@constants/api'
import DocsHeader from '../../doc-header/index.jsx'
import moment from 'moment'

import './entryForm.scss'
import './searchInput.scss'

class EntryForm extends Taro.Component {
  static defaultProps = {
    onDelete: () => {},
    onStash: () => {},
    onSelectSearch: () => {},
    onChangeTask: () => {},
    onChangeTasktime: () => {},
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
      open: false,
      isLoading: false,
      stashDisabled: false
    }

    this.handleSearchChange = _.debounce(this.handleSearchChange, 600,
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

        Taro.atMessage({
          'message': '从后台获取标准工时失败, 请手动输入工作项目和工时.',
          'type': 'warning',
        })
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

  handleTasktimeChange = (tasktime) => {
    const formID = this.props.formID

    this.setState({
      tasktime: tasktime,
      stashDisabled: false
    })

    // XXX: 将变化的 tasktime 暂存到 store 中.
    this.props.onChangeTasktime(formID, tasktime)

    return tasktime
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
      }, this.props.onChangeTask(formID, task, kind)), 800)

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

    Taro.showToast({
      title: `您点击了 ${task} .`,
      icon: 'none'
    })

    this.setState({open: false, task: task, tasktime: tasktime})
    this.props.onChangeTask(formID, task, kind)
    this.props.onChangeTasktime(formID, tasktime)
    // this.props.onSelectSearch(formID, task, tasktime)
  }

  handleFocus = () => {
    this.setState({open: false})
  }

  handleBlur = () => {
    this.setState({open: false})
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
      results: [],
      segmentations: [],
      airplane: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      task: '',
      tasktime: '',
      open: false,
      isLoading: false,
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

  render () {
    const { formID } = this.props
    const { isLoading, open, results, task, tasktime, airplane, date } = this.state

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
                    <View className='component-item__search-input-group'>
                      <View className='component-item__search-input-group__search-input-item'>
                        <View className='component-item__search-input-group__search-input-item__label'>
                          工作项目
                        </View>
                        <View className='component-item__search-input-group__search-input-item__value'>
                          {task}
                        </View>
                      </View>
                      <View className='component-item__input-group'>
                        <AtInput
                          name='tasktime'
                          title='工时'
                          type='text'
                          placeholder='自动填充'
                          value={tasktime}
                          onChange={this.handleTasktimeChange}
                        />
                      </View>
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
                      />
                    </View>
                    <View className='component-item__input-group'>
                      <AtInput
                        name='airplane'
                        title='机号'
                        type='text'
                        placeholder='请输入机号'
                        value={airplane}
                        onChange={this.handleAirplaneChange}
                      />
                    </View>

                    <View className='component-item__picker-group'>
                      <Picker mode='date' value={date} onChange={this.handleDateChange}>
                        <View className='component-item__picker-group__picker-item'>
                          <View className='component-item__picker-group__picker-item__label'>请选择日期</View>
                          <View className='component-item__picker-group__picker-item__value'>
                            {date}
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
      },
      onSelectSearch (formID, task, tasktime) {
        dispatch(selectSearch(formID, task, tasktime))
      },
      onChangeTask (formID, task, kind) {
        dispatch(changeTask(formID, task, kind))
      },
      onChangeTasktime (formID, tasktime) {
        dispatch(changeTasktime(formID, tasktime))
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm)
