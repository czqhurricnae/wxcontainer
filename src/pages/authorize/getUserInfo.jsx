import Taro, { Component } from '@tarojs/taro'
import View from '@tarojs/components'
import Modal from './modal.jsx'

import './index.scss'

export default class GetUserInfo extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      showAuthModal: true
    }
  }

  handleHideAuthModal = () => {
    this.setState({
      showAuthModal: false
    })
    Taro.setStorageSync('isHomeLongHideAuthModal', false)
  }

  handlePrcoessAuthResult = (userData) => {
    Taro.setStorageSync('isHomeLongHideAuthModal', true)

    this.setState({
      showAuthModal: false
    })
  }

  render () {
    const { showAuthModal } = this.state

    return (
      <View >
        {showAuthModal && <Modal
          title={'授权提示'}
          contentText={'申请获取您的公开信息(昵称, 头像等)'}
          onCancelCallback={this.handleHideAuthModal}
          onConfirmCallback={this.handlePrcoessAuthResult}
          isAuth />}
      </View>
    )
  }
}
