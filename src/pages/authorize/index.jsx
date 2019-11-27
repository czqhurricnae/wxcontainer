import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Auth from './auth'
import logoImg from '../../assets/images/maintenance.svg'

import './index.scss'

class UserLogin extends Component {
  config = {
    navigationBarTitleText: '登录'
  }

  render () {
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
