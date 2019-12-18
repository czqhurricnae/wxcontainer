import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCard, AtList, AtListItem, AtAvatar } from 'taro-ui'
import store from '../../store.jsx'
import defaultAvatar from '../../assets/images/default-avatar.png'
import bg from '../../assets/images/bg.jpg'
import level01 from '../../assets/images/level-01.png'

import './index.scss'

class Profile extends Component {

  static defaultProps = {
    userInfo: {}
  }

  constructor () {
    super(...arguments)
    this.state = {userInfo: {}}
  }

  componentDidShow () {
    /* XXX: 当 onLoad 之后, 先从 storage 获取用户信息. */
    const userInfo = Taro.getStorageSync('userInfo')
    this.setState({ userInfo })

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
    /* XXX: 当用户选择再次登录后, 用户信息可能发生改变, 使用 props 获取更新后的信息. */
    const { userInfo }  = this.props
    console.log(userInfo)

    this.setState({ userInfo })
  }

  render () {
    const { userInfo } = this.state

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
            <Text className='user-profile__info-NO'>
              {userInfo.login && userInfo.binded ? userInfo.number: ''}
            </Text>
            <Text className='user-profile__info-NO'>
              {userInfo.login && !userInfo.binded ? '未绑定工号, 请到个人中心进行绑定.': ''}
            </Text>
            <Text className='user-profile__info-authority'>
              {userInfo.login ? userInfo.authority: ''}
            </Text>
            {userInfo.login && userInfo.authority == '管理者' ?
             <View className='user-profile__info-wrap'>
               <Image className='user-profile__info-level' src={level01} />
               <Text className='user-profile__info-uid'>
                 {this.getUid(userInfo.uid)}
               </Text>
             </View> : ''
            }
            {!userInfo.login ?
             <Text className='user-profile__info-tip'>点击登录账号</Text>:
             ''
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
  return ({})
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
