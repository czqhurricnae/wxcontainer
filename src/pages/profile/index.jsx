import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtCard, AtList, AtListItem, AtAvatar } from 'taro-ui'
import defaultAvatar from '../../assets/images/default-avatar.png'
import bg from '../../assets/images/bg.jpg'

import './index.scss'

export default class Profile extends Component {
  constructor () {
    super(...arguments)
  }

  static defaultProps = {
    userInfo: {}
  }

  handleLogin = () => {
    if (!this.props.userInfo.login) {
      Taro.navigateTo({
        url: '/pages/authorize/index'
      })
    }
  }

  getUid = (uid) => {
    if (!uid || !/@/.test(uid)) {
      return ''
    }

    const [username, suffix] = uid.split('@')
    const firstLetter  = username[0]
    const lastLetter = username[username.length - 1]
    return `${firstLetter}****${lastLetter}@${suffix}`
  }

  render () {
    const { userInfo } = this.props

    return (
      <View className='user-profile'>

        <Image
          className='user-profile__bg'
          src={bg}
          mode='widthFix'
        />

        <View className='user-profile__wrap'>
          <View className='user-profile__avatar'>
            <Image
              className='user-profile__avatar-img'
              src={userInfo.avatar || defaultAvatar}
              onClick={this.handleLogin}
            />
          </View>

          <View className='user-profile__info' onClick={this.handleLogin}>
            <Text className='user-profile__info-name'>
              {userInfo.login ? userInfo.nickname : '未登录'}
            </Text>
            {userInfo.login ?
              <View className='user-profile__info-wrap'>
                <Text className='user-profile__info-uid'>
                  {this.getUid(userInfo.uid)}
                </Text>
              </View> :
              <Text className='user-profile__info-tip'>点击登录账号</Text>
            }
          </View>

        </View>
      </View>
    )
  }
}
