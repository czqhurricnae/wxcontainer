import Taro, { Component } from '@tarojs/taro'
import { AtButton, AtToast,  AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import './index.scss'

export default class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      showAuthModal: false,
      showToast: false,
      getAuthorize: true
    }
  }

  agreeAuth = () => {
    this.setState({showAuthModal: true})
  }

  handleCancelClick = () => {
    this.setState({showToast: true, showAuthModal: false})
    setTimeout(() => Taro.redirectTo({ url: '/pages/index/index' }), 4000)
  }

  handleGetInfoConfirmClick = (e) => {
    Taro.setStorageSync('isHomeLongHideAuthModal', true)

    this.setState({
      showAuthModal: false
    })

  }

  handleAuthConfirmClick = (e) => {
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
    const getAuthorize = this.state.getAuthorize

    return (
      <View className='user-login'>
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
          <AtModalContent >
            申请获取您的公开信息(昵称, 头像等).
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleCancelClick}>
              取消
            </Button>
            {
              getAuthorize ?
             <Button
               onClick={this.handleAuthConfirmClick}>
               授权
             </Button>
            :
             <Button
               openType='getUserInfo'
               onGetUserInfo={this.handleGetInfoConfirmClick}>
               授权
             </Button>
            }
          </AtModalAction>
        </AtModal>
        <AtToast
          isOpened={showToast}
          text={'您没有授权,工具查询可以正常使用, 但可能无法访问敏感信息或无法进行部分操作.'}
          duration={3500}
        >
        </AtToast>
      </View>
    )
  }
}
