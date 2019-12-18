import Taro, { Component } from '@tarojs/taro'
import Chart from './chart.jsx'

import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: "工时图示"
  }

  constructor () {
    super(...arguments)
  }

  render () {
    return (<Chart />)
  }
}
