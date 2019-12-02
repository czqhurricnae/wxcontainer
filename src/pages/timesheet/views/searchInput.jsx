import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { ClSearchBar } from "mp-colorui"
import { connect } from '@tarojs/redux'
import _ from 'lodash'
import { selectSearch, changeTask, changeTasktime } from '../actions.jsx'
import {
  tasksAPI,
  segmentationsAPI,
}
from '@constants/api'

import './searchInput.scss'

class SearchInput extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      source: [],
      results: [],
      segmentations: [],
      value: '',
      open: false,
      isLoading: false,
      taskTime: ''}
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

  handleTasktimeChange = (taskTime) => {
    const formID = this.props.formID

    this.setState({
      time: taskTime
    })

    // XXX: 让暂存键高亮.
    this.props.onTaskChange()
    // XXX: 将变化的 taskTime 暂存到 store 中.
    this.props.onChangeTasktime(formID, taskTime)

    return taskTime
  }

  handleSearchChange = (value) => {
    const formID = this.props.formID

    this.props.onTaskChange()

    this.setState({ isLoading: true, value })

    setTimeout(() => this.handleSegment(value))

    if (value === '') {
      setTimeout(() => {
        this.setState({isLoading: false, results: []})
      })
      return
    }

    setTimeout(() => {
      this.setState({isLoading: true})

      const isMatch = result => this.state.segmentations.every((item,
        index, array) => {
          return new RegExp(item).test(result.title)
        })

      setTimeout(() => this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
        open: Boolean(value.length),
        value: value
      }, this.props.onChangeTask(formID, value)))

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
            segmentations: res.data.filter((item,
              index, array) => (item.length > 1))
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
    const taskTime = results[index].taskTime

    Taro.showToast({
      title: `您点击了 ${task} .`,
      icon: 'none'
    })

    this.setState({open: false, value: task, taskTime: taskTime})
    this.props.onChangeTask(formID, task)
    this.props.onChangeTasktime(formID, taskTime)
    // this.props.onSelectSearch(formID, task, taskTime)
  }

  handleSearchClick = (value) => {
    this.setState({open: false, value: ''})

    Taro.showToast({
      title: '已重置',
      icon: 'none'
    })
  }

  handleFocus = () => {
    this.setState({open: false})
  }

  handleBlur = () => {
    this.setState({open: false})
  }

  render () {
    const { isLoading, open, results, taskTime  } = this.state

    return (
      <View className='component-item__search-input-group'>
        <View className='component-item__search-input-group__search-input-item'>
          <View className='component-item__search-input-group__search-input-item__label'>
            工作项目
          </View>
          <View className='component-item__search-input-group__search-input-item__value'>
            {this.state.value}
          </View>
        </View>
        <View className='component-item__input-group'>
          <AtInput
            name='taskTime'
            title='工时'
            type='text'
            placeholder='自动填充'
            value={taskTime}
            onChange={this.handleTasktimeChange}
          />
        </View>
        <ClSearchBar
          placeholder='搜索你的工作项目'
          showLoading={isLoading}
          showResult={open}
          result={results}
          onInput={_.debounce(this.handleSearchChange, 1200, {
            leading: true})}
          onTouchResult={this.handleSelect}
          onSearch={this.handleSearchClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          searchType={'none'}
        />
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
      onSelectSearch (formID, task, taskTime) {
        dispatch(selectSearch(formID, task, taskTime))
      },
      onChangeTask (formID, task) {
        dispatch(changeTask(formID, task))
      },
      onChangeTasktime (formID, taskTime) {
        dispatch(changeTasktime(formID, taskTime))
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput)
