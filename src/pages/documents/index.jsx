import Taro, { Component } from '@tarojs/taro'
import { AtCard } from 'taro-ui'
import { View } from '@tarojs/components'
import { ClSearchBar } from "mp-colorui"
import _ from 'lodash'
import DocsHeader from '../doc-header/index.jsx'
import { documentsAPI, documentAPI, segmentationsAPI } from '@constants/api'
import DocumentCard from './documentCard.jsx'

import './index.scss'

export default class Search extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      source: [],
      results: [],
      segmentations: [],
      documents:[],
      value: '',
      open: false,
      isLoading: false}

    this.handleSearchChange = _.debounce(this.handleSearchChange, 500,
                                         {leading: true})
  }

  config : Config = {
    navigationBarTitleText: '文档查询'
  }

  componentDidMount () {
    Taro.request({ url: documentsAPI , method: 'GET' })
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
      icon: 'none'
    })

    Taro.request({
      url: documentAPI + results[index].id,
      method: 'GET',
    })
      .then(res => {
        this.setState({documents: res.data})
      })
      .catch((error) => {
        console.log(error)
      })

    this.setState({open: false})
  }

  handleSearchClick = (search) => {
    Taro.showToast({
      title: `将会搜索所有关于 ${search} 的文档. `,
      icon: 'none'
    })

    Taro.request({
      url: documentsAPI,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({ search })
    })
      .then(res => {
        this.setState({documents: res.data})
      })
      .catch((error) => {
        console.log(error)
      })

    this.setState({open: false})
  }

  handleIconClick = (index) => {
    this.setState({open: !this.state.open})
  }

  render () {
    const { isLoading, open, results, documents  } = this.state

    return (
      <View>
        <View>
          <DocsHeader title='文档查询'></DocsHeader>
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
          />
        </View>
        <View>
          {documents.map((item, index, array) => (
            <DocumentCard document={item}></DocumentCard>
            )
          )}
        </View>
      </View>
    )
  }
}
