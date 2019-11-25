import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import './modal.scss'

class Modal extends Component {
  constructor() {
    super(...arguments)
    this.state = {}
  }

  handleConfirmClick = () => {
    this.props.onConfirmCallback()
  }

  handleCancelClick = () => {
    this.props.onCancelCallback()
  }

   handleAuthConfirmClick = (e) => {
    this.props.onConfirmCallback(e.detail)
  }

  handlePreventTouchMove = (e) => {
    e.stopPropagation()
  }

  render() {
    const { title, contentText, cancelText, confirmText} = this.props

    return (
      <AtModal isOpened onTouchMove={this.handlePreventTouchMove}>
        <AtModalHeader>{title}</AtModalHeader>
        <AtModalContent >
          {contentText}
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.handleCancelClick}>{cancelText}</Button>
          <Button onClick={this.handleConfirmClick}>{confirmText}</Button>
          <Button openType='getUserInfo' onGetUserInfo={this.handleAuthConfirmClick}>授权</Button>
        </AtModalAction>
      </AtModal>
    )
  }
}

Modal.defaultProps = {
  title: '',
  contentText: '',
  cancelText: '取消',
  confirmText: '确定',
  isAuth: false,
  cancelCallback: () => {},
  confirmCallback: () => {},
}

export default Modal
