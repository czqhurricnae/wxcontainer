import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClSearchBar } from "mp-colorui"
import _ from 'lodash'

import './index.scss'
import Table from './table.jsx'

export default class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      source: [],
      results: [],
      segmentations: [],
      projectsTools:[],
      value: '',
      open: false,
      isLoading: false}
  }

  componentWillMount () { }

  config : Config = {
    navigationBarTitleText: '工具查询'
  }

  componentDidMount () {
    const projects_API = 'http://localhost:5000/api/projects/'

    Taro.request({ url: projects_API, method: 'GET' })
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
    const segmentations_API = 'http://localhost:5000/api/segmentations/'

    Taro.request({
        url: segmentations_API,
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
    const tools_API = 'http://localhost:5000/api/tools/'
    const { results } = this.state

    Taro.showToast({
      title: `您点击了 ${results[index].title} .`,
      icon: 'none'
    })

    Taro.request({
      url: tools_API + results[index].id,
      method: 'GET',
    })
      .then(res => {
        this.setState({projectsTools: res.data})
      })
      .catch((error) => {
        console.log(error)
      })

    this.setState({open: false})
  }

  handleSearchClick = (search) => {
    const projects_tools_API = 'http://localhost:5000/api/projects/'

    Taro.showToast({
      title: `将会搜索所有关于  ${search} 的工具. `,
      icon: 'none'
    })

    Taro.request({
      url: projects_tools_API,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({ search })
    })
      .then(res => {
        this.setState({projectsTools: res.data})
      })
      .catch((error) => {
        console.log(error)
      })

    this.setState({open: false})
  }

  render () {
    const { isLoading, open, results, projectsTools  } = this.state

    return (
      <View>
        <ClSearchBar
          shape='round'
          bgColor='light-blue'
          placeholder='请输入搜索关键字'
          showLoading={isLoading}
          showResult={open}
          result={results}
          onInput={_.debounce(this.handleSearchChange, 1000, {
            leading: true})}
          onTouchResult={this.handleSelect}
          onSearch={this.handleSearchClick}
        />
        {projectsTools.map((item, index, array) => (
          <Table {...item}></Table>)
        )}
      </View>
    )
  }
}
