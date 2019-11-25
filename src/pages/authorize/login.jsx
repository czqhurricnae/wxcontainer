import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from './actions.jsx'
import { ButtonItem } from '@components'
import Auth from './auth'
import logoImg from '../../assets/images/maintenance.svg'

import './login.scss'

// TODO 由于 RN 的 app.js 中 initPxTransform 执行顺序关系,不能在 class 外用到 Taro.pxTransform
// const BUTTON = {
//   marginTop: Taro.pxTransform(30)
// }

@connect(state => state.user, actions)
class UserLogin extends Component {
  config = {
    navigationBarTitleText: '登录'
  }

  render () {
    const BUTTON = {
      marginTop: Taro.pxTransform(30)
    }

    return (
      <View className='user-login'>
        <View className='user-login__logo'>
          <Image src={logoImg} className='user-login__logo-img' />
        </View>
        <Auth />
      </View>
    )
  }
}

export default UserLogin
