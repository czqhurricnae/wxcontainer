import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClSearchBar } from "mp-colorui"
import { AtSearchBar, AtToast } from 'taro-ui'
import _ from 'lodash'

import './index.scss'
import request from '../utils/request.jsx'

export default class Index extends Component {

  config : Config = {
    navigationBarTitleText: '工具查询'
  }

  constructor () {
    super(...arguments)
    this.state = {
      source: [],
      results: [],
      segmentations: [],
      value: '',
      open: false,
      isLoading: false}
  }

  componentWillMount () { }

  componentDidMount () {
    const projectsAPI = 'http://localhost:5000/api/projects/'

    Taro.request({ url: projectsAPI, method: 'GET' })
      .then(res => {
        if (res.statusCode === 200) {
          this.setState({ source: res.data })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleSearchChange = (value) => {
    this.setState({isLoading: true, value})

    setTimeout(() => this.handleSegment(this.state.value))

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState({
        isLoading: false,
        open: false
      })

      const isMatch = result => this.state.segmentations.every((item,
        index, array) => {
        return new RegExp(item).test(result.title)
      })

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
        open: Boolean(value.length)
      })

    }, 500)
  }

  handleSegment = (search) => {
    const segmentationsAPI = 'http://localhost:5000/api/segmentations/'

    Taro.request({
        url: segmentationsAPI,
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
      data: JSON.stringify({ search })
    })
      .then(res => {
        console.log(res.data)
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

    Taro.showToast({
      title: `您点击了 ${results[index].title} `,
      icon: 'none'
    })

    this.handleSearch(results[index].title)
    this.setState({open: false})
  }

  handleSearch = (search) => {
    const toolsAPI = 'http://localhost:5000/api/tools/'

    Taro.request({
      url: toolsAPI,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({ search })
    })
      .then(res => {
        console.log(res.data)
      })
      .catch((error) => {
        console.log(error)
      })

  }

  render () {
    const { isLoading, open, results } = this.state

    return (
      <ClSearchBar
        shape='round'
        showLoading={isLoading}
        placeholder='请输入搜索关键字'
        onTouchResult={this.handleSelect}
        onInput={this.handleSearchChange}
        showResult={open}
        result={results}
      />
    )
  }
}
