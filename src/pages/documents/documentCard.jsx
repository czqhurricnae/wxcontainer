import Taro, { Component } from '@tarojs/taro'
import { AtCard } from 'taro-ui'
import downloadImg from '../../assets/images/download.svg'

export default class DocumentCard extends Component {
  handleCardClick = (document_id) => {
    console.log(document_id)
  }

  render () {
    const document = this.props.document
    return (
      <AtCard
        title={document.title}
        thumb={downloadImg}
        note={'点击下载'}
        onClick={this.handleCardClick(document.id)}>
        处室: {document.office} 机型: {document.model} 章节号: ATA-{document.chapter}
      </AtCard>
    )
  }
}
