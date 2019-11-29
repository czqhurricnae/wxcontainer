import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtGrid } from 'taro-ui'
import DocsHeader from '../doc-header/index.jsx'
import Profile from '../profile/index.jsx'
import searchImg from '../../assets/images/search.svg'
import checkImg from '../../assets/images/check.svg'
import userImg from '../../assets/images/user.svg'
import maintenanceImg from '../../assets/images/maintenance.svg'
import documentationImg from '../../assets/images/documentation.svg'

import './index.scss'

const dataSearch = [
  {
    link: '/pages/tools/index'
  }
]

const dataTimesheet = [
  {
    link: '/pages/timesheet/index'
  }
]

const dataUser= [
  {
    link: '/pages/authorize/index'
  }
]

export default class Index extends Taro.Component {

  config = {
    navigationBarTitleText: '导航页面'
  }

  static defaultProps = {
    userInfo: {}
  }

  constructor () {
    super(...arguments)
  }

  onShareAppMessage () {
    return {
      title: '小助手',
      path: '/pages/index/index',
      imageUrl: maintenanceImg
    }
  }

  handleClickSearch = (item, index) => {
    Taro.navigateTo({
      url: dataSearch[index].link
    })
  }

  handleClickTimesheet = (item, index) => {
    Taro.navigateTo({
      url: dataTimesheet[index].link
    })
  }

  handleClickUser= (item, index) => {
    Taro.navigateTo({
      url: dataUser[index].link
    })
  }

  render () {
    return (
      <View className='page'>

        <Profile></Profile>

        <View className='panel'>
          <View className='panel__title'>查询</View>
          <View className='panel__content'>
            <View className='panel__item'>
              <AtGrid data={
                [
                  {
                    image: searchImg,
                    value: '工具查询'
                  },
                  {
                    image: documentationImg,
                    value: '文档查询'
                  }
                ]
              }onClick={this.handleClickSearch}
              ></AtGrid>
            </View>
          </View>
        </View>

        <View className='panel'>
          <View className='panel__title'>工时</View>
          <View className='panel__content'>
            <View className='panel__item'>
              <AtGrid data={
              [
                {
                  image: checkImg,
                  value: '工时录入'
                }
              ]
              }onClick={this.handleClickTimesheet}
              ></AtGrid>
            </View>
          </View>
        </View>

        <View className='panel'>
          <View className='panel__title'>个人</View>
          <View className='panel__content'>
            <View className='panel__item'>
              <AtGrid data={
              [
                {
                  image: userImg,
                  value: '个人中心'
                }
              ]
              }onClick={this.handleClickUser}
              ></AtGrid>
            </View>
          </View>
        </View>

      </View>
    )
  }
}
