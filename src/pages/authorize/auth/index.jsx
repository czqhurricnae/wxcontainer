import Taro, { Component } from '@tarojs/taro'
import { AtButton } from 'taro-ui'

import './index.scss'

export default class Index extends Component {
  constructor () {
    super(...arguments)
  }

  agreeAuth = () => {
    Taro.getUserInfo().then((res) => {
      const { errMsg, userInfo } = res
      if (errMsg === 'getUserInfo:ok') {
        Taro.showToast({
          title: `微信昵称: ${userInfo.nickName},欢迎登录`,
          icon: 'none'
        })
      } else {
        Taro.showToast({
          title: '授权失败',
          icon: 'none'
        })
      }
    })
  }

  render () {
    return (
      <View className='user-login'>
        <AtButton
          type='primary'
          circle
          openType='getUserInfo'
          onGetUserInfo={this.agreeAuth}>
          微信登录
        </AtButton>
      </View>
    )
  }
}
