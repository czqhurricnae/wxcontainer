import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class Table extends Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const projectTitle = this.props.project_title
    const tools = this.props.tools

    return (
      <View>
        <View className='title'>{projectTitle}</View>
        <View className='table_view'>
          <View className='table_header'>
            <View className='th th1'>序号</View>
            <View className='th th2'>名称</View>
            <View className='th th3'>规格尺寸</View>
            <View className='th th4'>数量</View>
            <View className='th th5'>备注</View>
          </View>
          {tools.map((item, index, array) => (
            <View className='table_cell'>
              <View className='td td1' key={item.name}>{index + 1}</View>
              <View className='td td2' key={item.name}>{item.name}</View>
              <View className='td td3' key={item.name}>{item.size}</View>
              <View className='td td4' key={item.name}>{item.number}</View>
              <View className='td td5' key={item.name}>{item.description}</View>
            </View>)
          )}
        </View>
      </View>
    )
  }
}
