import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import DocsHeader from '../doc-header'
import EntryForm from './entryForm.jsx'

import './dataEntry.scss'


export default class DataEntry extends Taro.Component {
  render () {
    return (
      <View className='page flex-page' >
        <DocsHeader title='工时录入' />
        <EntryForm></EntryForm>
      </View>
    )
  }
}
