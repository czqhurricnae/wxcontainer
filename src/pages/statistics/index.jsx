import Taro, { Component } from '@tarojs/taro'
import Chart from './chart.jsx'

import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: "班组工时月份统计图示"
  }

  constructor () {
    super(...arguments)
  }

  render () {
    return (<Chart />)
  }
}
