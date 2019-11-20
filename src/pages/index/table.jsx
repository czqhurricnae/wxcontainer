import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './table.scss'

export default class Table extends Component {
  constructor (props) {
    super(props)
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
              <View className='td td1'>{index + 1}</View>
              <View className='td td2'>{item.name}</View>
              <View className='td td3'>{item.size}</View>
              <View className='td td4'>{item.number}</View>
              <View className='td td5'>{item.description}</View>
            </View>)
          )}
        </View>
      </View>
    )
  }
}
