import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtButton, AtToast } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { logout } from '../authorize/actions.jsx'

import './index.scss'

class User extends Component {
  config = {
    navigationBarTitleText: '账号管理'
  }

  constructor () {
    super(...arguments)

    this.state={
      showToast: false,
      toastText: '',
    }
  }

  handleBind = () => {
    Taro.navigateTo({
      url:'/pages/bind/index'
    })
  }

  handleLogout = () => {
    Taro.removeStorageSync('userInfo')
    this.props.onLogout()

    this.setState({
      showToast: true,
      toastText: '退出登录成功, 将跳转回首页!'
    })

    setTimeout(() => Taro.redirectTo({ url: '/pages/index/index' }), 3000)
  }

  render () {
    const { showToast, toastText } = this.state

    return (
      <View className='user-group'>
        <AtToast
          isOpened={showToast}
          text={toastText}
          duration={3500}
        >
        </AtToast>
        <AtList>
          <AtListItem title='绑定工号' onClick={this.handleBind} arrow='right'></AtListItem>
        </AtList>
        <AtButton
          type='primary'
          className='user-group__logout-item'
          onClick={this.handleLogout}>退出登录</AtButton>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
  return (
    {
      onLogout () {
        dispatch(logout())
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(User)
