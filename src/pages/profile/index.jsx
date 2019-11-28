import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCard, AtList, AtListItem, AtAvatar } from 'taro-ui'
import store from '../../store.jsx'
import defaultAvatar from '../../assets/images/default-avatar.png'
import bg from '../../assets/images/bg.jpg'

import './index.scss'

class Profile extends Component {

  static defaultProps = {
    userInfo: {}
  }

  constructor () {
    super(...arguments)
  }

  componentDidShow () {
    store.subscribe(() => this._updateUserInfo())
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

  _updateUserInfo = () => {
    const { userInfo } = this.props

    this.setState({userInfo})
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
              src={userInfo.avatarUrl || defaultAvatar}
              onClick={this.handleLogin}
            />
          </View>

          <View className='user-profile__info' onClick={this.handleLogin}>
            <Text className='user-profile__info-name'>
              {userInfo.login ? userInfo.nickName : '未登录'}
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

const mapStateToProps = (state) => {
  return (
    {
      userInfo: state.userInfo
    }
  )
}

const mapDispatchToProps = (dispatch) => {
  return ({

  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
