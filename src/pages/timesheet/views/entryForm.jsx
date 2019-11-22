import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtCard } from 'taro-ui'
import DocsHeader from '../../doc-header/index.jsx'
import { connect } from '@tarojs/redux'
import { deleteForm, stashForm } from '../actions.jsx'
import './entryForm.scss'

class EntryForm extends Taro.Component {
  static defaultProps = {
    onDelete: () => {},
    onStash: () => {}
  }

  constructor () {
    super (...arguments)
    this.state = {
      airplane: '',
      time: '',
      isDisabled: false
    }
  }

  componentDidMount () {

  }

  handleAirplaneChange = (value) => {
    this.setState({
      airplane: value,
      isDisabled: false
    })

    return value
  }

  handleTimeChange = (value) => {
    this.setState({
      time: value,
      isDisabled: false
    })

    return value
  }

  handleSubmit = (event) => {
    const formID = this.props.formID
    const datasheet = {airplane: this.state.airplane, time: this.state.time}

    this.props.onStash(formID, datasheet)
    this.setState({isDisabled: true})
  }

  handleReset = (event) => {
    this.setState({
      airplane: '',
      time: '',
      isDisabled: false
    })
  }

  handleDelete () {
    const { formID } = this.props
    Taro.atMessage({
      'message': '已经删除',
      'type': 'warning',
    })
    this.props.onDelete(formID)
  }

  render () {
    const { formID } = this.props

    console.log(this.props.datasheets)
    return (
      <View className='page'>
        <View className='doc-body'>
          <View className='panel'>
            <View className='panel__content'>
              <View className='component-item'>
                <AtCard
                  title={String(formID)}
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
                    <View className='component-item__input-group'>
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
                        <AtButton  size='small' onClick={this.handleDelete.bind(this)}>删除</AtButton>
                      </View>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton formType='reset' size='small'>重置</AtButton>
                      </View>
                      <View className='component-item__btn-group__btn-item'>
                        <AtButton type='primary' formType='submit' size='normal' disabled ={this.state.isDisabled}>暂存</AtButton>
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

const mapStateToProps = (state) => {
  return (
    {
      datasheets: state.datasheets
    }
  )
}

const mapDispatchToProps = (dispatch) => {
  return (
    {
      onDelete (formID) {
        dispatch(deleteForm(formID))
      },
      onStash (formID, datasheet) {
        dispatch(stashForm(formID, datasheet))
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm)
