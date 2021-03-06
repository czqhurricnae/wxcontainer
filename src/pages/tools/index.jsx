import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClSearchBar } from "mp-colorui"
import _ from 'lodash'
import Table from '../table/index.jsx'
import DocsHeader from '../doc-header/index.jsx'
import {
  projectsAPI,
  segmentationsAPI,
  toolsAPI,
  projectsToolsAPI
}
from '@constants/api'

import './index.scss'

export default class Search extends Component {
  config = {
    navigationBarTitleText: '工具查询'
  }

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

    this.handleSearchChange = _.debounce(this.handleSearchChange, 500, {
      leading: true})
  }

  componentWillMount () { }

  componentDidMount () {
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
      }), 500)

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

    Taro.showToast({
      title: `您点击了 ${results[index].title} .`,
      icon: 'none',
      duration: 2500
    })

    Taro.request({
      url: toolsAPI + results[index].id,
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
    if (search !== '') {
      Taro.showToast({
        title: `将会搜索所有关于 ${search} 的工具. `,
        icon: 'none',
        duration: 2500
      })

      Taro.request({
        url: projectsToolsAPI,
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
    } else {
      Taro.showToast({
        title: '请输入要查询的关键字.',
        icon: 'none',
        duration: 2500
      })
    }
  }

  handleIconClick = (index) => {
    this.setState({open: !this.state.open})
  }

  render () {
    const { isLoading, open, results, projectsTools  } = this.state

    return (
      <View>
        <DocsHeader title='工具查询'></DocsHeader>
        <ClSearchBar
          shape='round'
          bgColor='blue'
          placeholder='请输入搜索关键字'
          showLoading={isLoading}
          showResult={open}
          result={results}
          onInput={this.handleSearchChange}
          onTouchResult={this.handleSelect}
          onSearch={this.handleSearchClick}
          leftIcons={ open ? ['fold'] : ['unfold']}
          onIconClick={this.handleIconClick}
        />
        {projectsTools.map((item, index, array) => (
          <Table {...item} key={item.project_title}></Table>)
        )}
      </View>
    )
  }
}
