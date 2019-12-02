import Taro, { Component } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import { adminURL } from '@constants/api'

import './index.scss'

export default class Admin extends Component {
  render () {
    return (
      <WebView src={adminURL} />
    )
  }
}
