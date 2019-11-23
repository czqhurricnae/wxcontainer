import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClSearchBar } from "mp-colorui"
import _ from 'lodash'

import './searchInput.scss'


export default class SearchInput extends Component {
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

  handleSearchChange = (value) => {
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

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
        open: Boolean(value.length),
        value: value
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
    const toolsAPI = 'http://localhost:5000/api/tools/'
    const { results } = this.state

    Taro.showToast({
      title: `您点击了 ${results[index].title} .`,
      icon: 'none'
    })

    this.setState({open: false, value: results[index].title})
  }

  handleSearchClick = (value) => {
    this.setState({open: false, value: ''})

    Taro.showToast({
      title: '已重置',
      icon: 'none'
    })
  }

  render () {
    const { isLoading, open, results  } = this.state

    return (
      <View>
        <ClSearchBar
          placeholder='搜索你的工作项目'
          showLoading={isLoading}
          showResult={open}
          result={results}
          onInput={_.debounce(this.handleSearchChange, 1000, {
            leading: true})}
          onTouchResult={this.handleSelect}
          onSearch={this.handleSearchClick}
        />
      </View>
    )
  }
}
