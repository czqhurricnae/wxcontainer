import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtButton } from 'taro-ui'

import './index.scss'

export default class User extends Component {
  constructor () {
    super(...arguments)
  }

  handleBind = () => {
    Taro.navigateTo({
      url:'/pages/bind/index'
    })
  }

  render () {
    return (
      <View className='user-group'>
        <AtList>
          <AtListItem title='绑定工号' onClick={this.handleBind} arrow='right'></AtListItem>
        </AtList>
        <AtButton type='primary' className='user-group__logout-item'>退出登录</AtButton>
      </View>
    )
  }
}
