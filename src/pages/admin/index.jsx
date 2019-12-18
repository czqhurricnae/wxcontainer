import Taro, { Component } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import { adminURL } from '@constants/api'

import './index.scss'

export default class Admin extends Component {
  config = {
    navigationBarTitleText: '后台管理'
  }

  render () {
    return (
      <WebView src={adminURL} />
    )
  }
}
