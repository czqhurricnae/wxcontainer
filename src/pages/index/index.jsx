import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtGrid } from 'taro-ui'
import DocsHeader from '../doc-header/index.jsx'
import Profile from '../profile/index.jsx'
import searchImg from '../../assets/images/search.svg'
import checkImg from '../../assets/images/check.svg'
import userImg from '../../assets/images/user.svg'
import maintenanceImg from '../../assets/images/maintenance.svg'

import './index.scss'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '导航页面'
  }

  constructor () {
    super(...arguments)
    this.state = { data: [
      {
         link: '/pages/tools/index'
      },
      {
         link: '/pages/timesheet/index'
      },
      {
         link: '/pages/authorize/login'
      }
    ] }
  }

  onShareAppMessage () {
    return {
      title: '小助手',
      path: '/pages/index/index',
      imageUrl: maintenanceImg
    }
  }

  handleClick = (item, index) => {
    Taro.navigateTo({
      url: this.state.data[index].link
    })
  }

  render () {
    return (
      <View className='page'>

        <Profile></Profile>

        <AtGrid data={
        [
          {
            image: searchImg,
            value: '工具查询'
          },
          {
            image: checkImg,
            value: '工时录入'
          },
          {
            image: userImg,
            value: '个人中心'
          }
        ]
        }
           onClick={this.handleClick}
        ></AtGrid>
      </View>
    )
  }
}
