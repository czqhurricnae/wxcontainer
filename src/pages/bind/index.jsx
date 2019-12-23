import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import {
  AtButton,
  AtMessage,
  AtNoticebar,
  AtToast
} from 'taro-ui'
import{ ClForm, ClFormItem, ClInput } from 'mp-colorui'
import { connect } from '@tarojs/redux'
import _ from 'lodash'
import { teamsAPI, updateUserInfoAPI } from '@constants/api'
import { getUserInfo } from '../authorize/actions.jsx'
import DocsHeader from '../doc-header/index.jsx'

import './index.scss'

class Bind extends Component {
  config = {
    navigationBarTitleText: '工号绑定'
  }

  constructor () {
    super(...arguments)

    this.state = {
      nickName: '',
      openId: '',
      teamMaps: [],
      teams: [],
      model: {number: ''},
      teamChecked: '',
      teamID: '',
      showNoticebar: false,
      disabledSubmit: false,
      showToast: false,
      toastText: ''
    }
  }

  componentDidMount () {
    const userInfo  = Taro.getStorageSync('userInfo')
    const login = userInfo && userInfo.login
    const nickName = userInfo && userInfo.nickName
    const openId = userInfo && userInfo.openId

    if (!userInfo ||!openId || !login) {
      this.setState({
        showNoticebar: true,
        disabledSubmit: true
      })

      return
    }
    else {
      this.setState({
        nickName,
        openId
      })
    }

    Taro.request({ url: teamsAPI, method: 'GET' })
      .then(res => {
        if (res.statusCode === 200) {
          const teams = Object.values(res.data)
          const teamMaps = _.invert(res.data)

          this.setState({ teams, teamMaps })
        }
      })
      .catch((error) => {
        console.log(error)

        Taro.atMessage({
          'message': '从后台获取标准班组列表失败!',
          'type': 'warning'
        })
      })
  }

  handleNickNameChange = (nickName) => {
    this.setState({nickName: nickName})
  }

  handleNumberChange = (value) => {
    this.setState({
      model: {
        ...this.state.model,
        number: value
      }
    })
  }

  handleSelect = (e) => {
    const teamChecked = this.state.teams[e.detail.value]
    const teamID = this.state.teamMaps[teamChecked]

    this.setState({
      teamChecked,
      teamID
    })
  }

  handleBind = (e) => {
    if (this.state.teamChecked == '') {
      Taro.showToast({
        'title': '请先选择一个班组!',
        'icon': 'none'
      })
    }

    if (this.state.nickName == '') {
      Taro.showToast({
        'title': '请先输入名称!',
        'icon': 'none'
      })
    }

    this.ref.validate(validated => {
      if (validated) {
        const { nickName, openId, teamID } = this.state
        const number = this.state.model.number

        Taro.request({
          url: updateUserInfoAPI,
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          data: JSON.stringify({
            'nickName': nickName,
            'openId': openId,
            'number': number,
            'teamID': teamID
          })
        })
          .then(res => {
            if (res.statusCode === 200) {
              const userInfo = Taro.getStorageSync('userInfo')
              Taro.setStorageSync('userInfo', {...userInfo, ...res.data})
              this.props.onLogin({...userInfo, ...res.data})

              this.setState({
                showToast: true,
                toastText: '绑定成功, 将跳转回首页.',
                showAuthModal: false
              })

              setTimeout(() => Taro.redirectTo({ url: '/pages/index/index' }), 3000)
            }
            else if(res.statusCode === 409) {
              console.log(res.statusCode, res.data.message)

              Taro.atMessage({
                'message': `绑定时出现错误, 错误信息为: 此工号已经被其他人绑定!`,
                'type': 'error'
              })
            }
            else {
              console.log(res.statusCode, res.data.message)

              Taro.atMessage({
                'message': `绑定时出现错误, 错误信息为: ${res.data.message}!`,
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
    })
  }

  refFunc = (node) => {
    this.ref = node
  }

  render () {
    const {
      showNoticebar,
      disabledSubmit,
      showToast,
      toastText,
      model,
      teams,
      teamChecked,
      nickName
    } = this.state

    const rules = {
      number(rule, value, callback) {
        if (!rule.required(value)) {
            callback('请先输入工号!')

          return false
        }

        if (!rule.number(value)) {
          callback('请输入数字!')

          return false
        }

        if (value.length != 5) {
          callback('请输入正确位数的工号!')

          return false
        }

        return true
      }
    }

    return (
      <View>
        {showNoticebar ?
         <AtNoticebar icon='volume-plus'>
           请先在导航页面使用微信进行授权登录!
         </AtNoticebar>
        : ''}
        <AtMessage></AtMessage>
        <AtToast
          isOpened={showToast}
          text={toastText}
          duration={3500}
        >
        </AtToast>
        <DocsHeader title='绑定工号' />
        <View className='doc-body'>
          <View className='panel'>
            <View className='panel__content no-padding'>
              <View className='picker'>
                <Picker mode='selector' range={teams} onChange={this.handleSelect}>
                  <View className='picker__item'>
                    <View className='picker__item__label'>
                      请选择班组
                    </View>
                    <View className='picker__item__value'>
                      {teamChecked}
                    </View>
                  </View>
                </Picker>
              </View>
              <ClForm ref={this.refFunc} model={model} rules={rules}>
                <ClFormItem prop='name' required>
                  <ClInput
                    name='nickName'
                    title='名称'
                    type='text'
                    placeholder='名称'
                    value={nickName}
                    onBlur={this.handleNickNameChange}
                  />
                </ClFormItem>
                <ClFormItem prop='number' required>
                  <ClInput
                    name='nickName'
                    title='工号'
                    type='number'
                    placeholder='请输入工号'
                    value={model.number}
                    onBlur={this.handleNumberChange}
                  />
                </ClFormItem>
              </ClForm>
              <AtButton className='panel__button'
                type='primary'
                disabled={disabledSubmit}
                onClick={this.handleBind}
              >绑定</AtButton>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
  return (
    {
      onLogin (userInfo) {
        dispatch(getUserInfo(userInfo))
      }
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Bind)
