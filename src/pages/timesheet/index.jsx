import Taro from '@tarojs/taro'
import DataEntry from './dataEntry.jsx'

import './index.scss'

export default class TimeSheet extends Taro.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    return (
      <DataEntry />
    )
  }
}
