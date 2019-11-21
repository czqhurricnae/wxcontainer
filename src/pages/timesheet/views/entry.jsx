import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import DocsHeader from '../doc-header'
import './entry.scss'

export default class Entry extends Taro.Component {
  render () {
    return (
      <View className='page flex-page' >
        <DocsHeader title='工时录入暂存' />
      </View>
    )
  }
}
