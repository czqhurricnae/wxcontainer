import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtCard } from 'taro-ui'
import DocsHeader from '../doc-header'
import './entryForm.scss'

export default class EntryForm extends Taro.Component {
  constructor () {
    super (...arguments)
    this.state = {
      airplane: '',
      time: ''
    }
  }

  componentDidMount () {

  }

  handleAirplaneChange = (value) => {
    this.setState({
      airplane: value
    })

    return value
  }

  handleTimeChange = (value) => {
    this.setState({
      time: value
    })

    return value
  }

  handleSubmit = (event) => {
    console.log(this.state)
  }

  handleReset = (event) => {
    this.setState({
      airplane: '',
      time: '',
    })
  }

  render () {
    return (
      <View className='page'>
        <View className='doc-body'>
          <View className='panel'>
            <View className='panel__content'>
              <View className='component-item'>
                <AtCard
                  title={1}
                  note='点击 + 号来继续添加表单.'
                >
                  <AtForm
                    onSubmit={this.handleSubmit}
                    onReset={this.handleReset}
                  >
                    <View className='component-item__input-group'>
                      <AtInput
                        name='airplane'
                        title='机号'
                        type='text'
                        placeholder='请输入机号'
                        value={this.state.airplane}
                        onChange={this.handleAirplaneChange}
                      />
                    </View>
                    <View class="component-item__input-group">
                      <AtInput
                        name='time'
                        title='工时'
                        type='text'
                        placeholder='自动填充'
                        value={this.state.time}
                        onChange={this.handleTimeChange}
                      />
                    </View>
                    <View className='component-item__btn-group'>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton formType='submit' size='small'>删除</AtButton>
                      </View>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton formType='reset' size='small'>重置</AtButton>
                      </View>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton formType='submit' size='small'>提交</AtButton>
                      </View>
                    </View>
                  </AtForm>
                </AtCard>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
