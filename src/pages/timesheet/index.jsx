import Taro from '@tarojs/taro'
import DataEntry from './dataEntry.jsx'

import './index.scss'

export default class TimeSheet extends Taro.Component {
  config = {
    navigationBarTitleText: '工时录入'
  }

  constructor () {
    super(...arguments)
  }

  render () {
    return (
      <DataEntry />
    )
  }
}
