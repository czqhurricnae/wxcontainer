import Taro from '@tarojs/taro'
import {
  AtButton,
  AtToast,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtMessage } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { getUserInfo } from '../actions.jsx'
import { code2sessionAPI, userInfoAPI } from '@constants/api'

import './index.scss'

class Index extends Taro.Component {
  static defaultProps = {
    onLogin : () => {},
  }

  constructor () {
    super(...arguments)
    this.state = {
      showAuthModal: false,
      showToast: false,
      getAuthorize: true,
      toastText: ''
    }
  }

  componentDidMount() {
    Taro.login()
      .then((res) => {
        Taro.request({
            url: code2sessionAPI,
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            data: JSON.stringify({ code: res.code })
          })
          .then(res => {
            if (res.statusCode === 200) {
              Taro.setStorageSync('sessionKey', res.data)
            }
          })
          .catch((error) => {
            console.log(error)

            Taro.atMessage({
              'message': `与后台服务器连接时出现错误, 错误信息为: ${error.errMsg}.`,
              'type': 'warning',
            })
          })
      })
      .catch((error) => {
        console.log(error)

        Taro.atMessage({
          'message': '微信登录失败, 请检查您的网络连接.',
          'type': 'error',
        })
      })
  }

  agreeAuth = () => {
    this.setState({showAuthModal: true})
  }

  handleCancelClick = () => {
    this.setState({showToast: true,
                   toastText: '您没有授权,工具查询可以正常使用, 但可能无法访问敏感信息或无法进行部分操作.',
                   showAuthModal: false})
    setTimeout(() => Taro.redirectTo({ url: '/pages/index/index' }), 4000)
  }

  // XXX NOTE: 无法使用 getPhoneNumber.
  handleGetInfoConfirmClick = (e) => {
    const sessionKey = Taro.getStorageSync('sessionKey')

    Taro.checkSession().then((res) => {
      if (res.errMsg == 'checkSession:ok') {
        const encryptedData = e.detail.encryptedData
        const iv = e.detail.iv

        Taro.request({
          url: userInfoAPI,
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          data: JSON.stringify({
            'session_key': sessionKey,
            'encrypted_data': encryptedData,
            'iv': iv
          })
        })
          .then(res => {
            if (res.statusCode === 200) {
              const userInfo = res.data

              Taro.setStorageSync('userInfo', userInfo)
              this.props.onLogin(userInfo)

              this.setState({showToast: true,
                             toastText: '登录成功, 将跳转回首页.',
                             showAuthModal: false})

              setTimeout(() => Taro.redirectTo({ url: '/pages/index/index' }), 3000)
            }
          })
          .catch((error) => {
            console.log(error)

            Taro.atMessage({
              'message': `与后台服务器连接时出现错误, 错误信息为: ${error.errMsg}.`,
              'type': 'warning',
            })
          })
      }
    })
      .catch((error) => {
        console.log(error)

        Taro.atMessage({
          'message': '检查 sessionKey 出现错误, 请关闭小程序后重新登录.',
          'type': 'warning',
        })
      })

    Taro.setStorageSync('isHomeLongHideAuthModal', true)

    this.setState({
      showAuthModal: false
    })
  }

  handlePreventTouchMove = (e) => {
    e.stopPropagation()
  }

  render () {
    const showAuthModal= this.state.showAuthModal
    const showToast= this.state.showToast
    const toastText = this.state.toastText
    const getAuthorize = this.state.getAuthorize

    return (
      <View className='user-login'>
        <AtMessage></AtMessage>
        <AtButton
          type='primary'
          circle
          onClick={this.agreeAuth}>
          微信登录
        </AtButton>
        <AtModal isOpened={showAuthModal}
          onTouchMove={this.handlePreventTouchMove}>
          <AtModalHeader>
            授权提示
          </AtModalHeader>
          <AtModalContent>
            申请获取您的公开信息(昵称, 头像等).
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleCancelClick}>
              取消
            </Button>
            <Button openType='getUserInfo'
              onGetUserInfo={this.handleGetInfoConfirmClick}>
              授权
            </Button>
          </AtModalAction>
        </AtModal>
        <AtToast
          isOpened={showToast}
          text={toastText}
          duration={3500}
        >
        </AtToast>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
  return (
    {
      onLogin (userInfo) {
        dispatch(getUserInfo(userInfo))
      }
    }
  )
}

export default connect( mapStateToProps, mapDispatchToProps)(Index)
