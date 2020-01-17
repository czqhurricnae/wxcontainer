import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import {
  AtButton,
  AtMessage,
  AtNoticebar,
  AtToast
} from 'taro-ui'
import { ClTree } from 'mp-colorui'
import { chaptersAPI } from '@constants/api'

import './index.scss'

const modelsMap = {'0': '737-678', '1': '737-max', '2': '787', '3': '757'}

export default class Chapter extends Component {
  config = {
    navigationBarTitleText: '章节号查询'
  }

  constructor () {
    super(...arguments)

    this.state = {
      modelChecked : '787',
      treeData: []
    }
  }

  componentDidMount () {
    const { modelChecked } = this.state

    this._updateRequest(modelChecked)
  }

  handleSelect = (e) => {
    const modelChecked = modelsMap[e.detail.value]

    this.setState({modelChecked})
  }

  handleSearch = (e) => {
    const { modelChecked } = this.state

    this._updateRequest(modelChecked)
    this.forceUpdate()
  }

  _updateRequest = (model) => {
    Taro.request({
      url: chaptersAPI,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({
        'model': model,
      })
    })
      .then(res => {
        if (res.statusCode === 200) {
          const rawData = res.data
          const newData = {}
          const treeData = []

          for(let item of rawData) {
            const chapterKey = `${item.belongto_chapter} ${item.chapter_description}`
            if (newData[chapterKey] === undefined) {
              newData[chapterKey] = []
            }
            newData[chapterKey].push({name: `${item.chinese_description}(${item.english_description}): ${item.chapter_section_number}`})
          }

          Object.keys(newData).map((item, index, array) => {
            treeData.push({name: item, children: newData[item]})
          })

          this.setState({ treeData })
        }
        else {
          console.log(res.statusCode, res.data.message)

          Taro.atMessage({
            'message': `请求数据时出现错误, 错误信息为: ${res.data.message}!`,
            'type': 'error'
          })
        }
      })
      .catch((error) => {
        console.log(error)

        Taro.atMessage({
          'message': `与后台服务器连接时出现错误, 错误信息为: ${error.errMsg}!`,
          'type': 'warning'
        })
      })
  }

  render () {
    const models = Object.values(modelsMap)
    const { modelChecked, treeData } = this.state

    return (
      <View className='doc-body'>
        <View className='panel'>
          <View className='panel__content no-padding'>
            <View className='picker'>
              <Picker mode='selector' range={models} onChange={this.handleSelect}>
                <View className='picker__item'>
                  <View className='picker__item__label'>
                    请选择机型
                  </View>
                  <View className='picker__item__value'>
                    {modelChecked}
                  </View>
                </View>
              </Picker>
            </View>
            <AtButton className='panel__button' type='primary' onClick={this.handleSearch}>查询</AtButton>
          </View>
        </View>
        <ClTree data={treeData} />
      </View>
    )
  }
}
