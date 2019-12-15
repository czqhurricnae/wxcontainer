import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import downloadImg from '../../assets/images/download.svg'

import './documentCard.scss'

export default class DocumentCard extends Component {
  handleCardClick = () => {
    const document_url = this.props.document.get_url

    Taro.downloadFile({
      url: document_url,
      method: 'GET'
    })
      .then((res) => {
        if (res.errMsg == 'downloadFile:ok')
        {
          const filePath = res.tempFilePath
          Taro.openDocument({filePath})
            .then((res) => {
            })
            .catch((error) => {
              Taro.showToast({
                title: error.errMsg,
                icon: 'none'
              })
            })
        }
        else {
          Taro.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        }
      })
      .catch((error) => {
        Taro.showToast({
          title: error.errMsg,
          icon: 'none'
        })
      })
  }

  render () {
    const document  = this.props.document || {}

    return (
      <View className={'card-item'}>
        <AtCard
          title={document.title}
          thumb={downloadImg}
          note={'点击下载'}
          onClick={this.handleCardClick}>
          处室: {document.office}
          机型: {document.model}
          章节号: ATA-{document.chapter}
        </AtCard>
      </View>
    )
  }
}
