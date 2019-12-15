import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtInput, AtForm, AtCard } from 'taro-ui'
import DocsHeader from '../doc-header/index.jsx'
import { teamsAPI } from '@constants/api'
import './index.scss'

export default class User extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      teams: [],
      selectorChecked: ''
    }
  }

  componentDidMount () {
    Taro.request({ url: teamsAPI, method: 'GET' })
      .then(res => {
        if (res.statusCode === 200) {
          const teams = res.data.map(item => (item.name))

          this.setState({ teams })
        }
      })
      .catch((error) => {
        console.log(error)

        Taro.atMessage({
          'message': '从后台获取标准班组列表!',
          'type': 'warning',
        })
      })
  }

  handleSelect = (e) => {
    this.setState({
      selectorChecked: this.state.teams[e.detail.value]
    })
  }

  render () {
    return (
      <View>
        <DocsHeader title='绑定工号' />
        <View className='doc-body'>
          <View className='panel'>
            <View className='panel__content no-padding'>
              <AtForm>
                <AtInput name='nickName' title='名称' type='text' placeholder='名称' value={this.state.nickName} />
                <AtInput name='nickName' title='工号' type='text' placeholder='工号' value={this.state.nickName} />
                <View className='picker'>
                  <Picker mode='selector' range={this.state.teams} onChange={this.handleSelect}>
                    <View className='picker__item'>
                      <View className='picker__item__label'>选择班组</View>
                      <View className='picker__item__value'>{this.state.selectorChecked}</View>
                    </View>
                  </Picker>
                </View>
              </AtForm>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
