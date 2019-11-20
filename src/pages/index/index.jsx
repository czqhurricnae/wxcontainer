import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtGrid } from 'taro-ui'
import DocsHeader from '../doc-header'
import './index.scss'
import searchImg from '../../assets/images/search.svg'
import checkImg from '../../assets/images/check.svg'
import userImg from '../../assets/images/user.svg'


export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '导航页面'
  }

  constructor () {
    super(...arguments)
  }

  onShareAppMessage () {
    return {
      title: '导航页面',
      path: '/pages/index/index',
      imageUrl: 'http://storage.360buyimg.com/mtd/home/share1535013100318.jpg'
    }
  }

  gotoPanel = e => {
    const { id } = e.currentTarget.dataset
    Taro.navigateTo({
      url: `/pages/panel/index?id=${id.toLowerCase()}`
    })
  }

  handleClick = () => {
    console.log('click')
    Taro.navigateTo({
      url:'/pages/tools/search'
    })

  }

  render () {
    const { data } = this.state

    return (
      <View className='page'>
        {/* S Header */}
        <DocsHeader title='欢迎使用'></DocsHeader>
        {/* E Header */}
        <View className='panel-header'>
          <View className='panel-header__icon' onclick={this.handleClick}>
            <Image src={searchImg} className='img' mode='widthFix'>
            </Image>
          </View>
          <View className='panel-header__title'>工具查询</View>
        </View>

        <View className='panel-header'>
          <View className='panel-header__icon'>
            <Image src={checkImg} className='img' mode='widthFix'>
            </Image>
          </View>
          <View className='panel-header__title'>工时录入</View>
        </View>

        <View className='panel-header'>
          <View className='panel-header__icon'>
            <Image src={userImg} className='img' mode='widthFix'>
            </Image>
          </View>
          <View className='panel-header__title'>个人</View>
        </View>
      </View>
    )
  }
}
