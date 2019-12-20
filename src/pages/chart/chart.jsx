import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtButton, AtNoticebar, AtMessage } from 'taro-ui'
import moment from 'moment'
import Echart from 'echarts12'
import { approvedTimesheetsAPI } from '@constants/api'

import "./chart.scss";

export default class Chart extends Component {
  constructor() {
    super(...arguments)
    const date = new Date()

    this.state = {
      startDate:moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD'),
      showNoticebar: false,
      newData: {}
    }
  }

  componentDidMount () {
    const userInfo = Taro.getStorageSync('userInfo')
    const number = userInfo && userInfo.number
    const date = new Date()
    const startDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD')
    const endDate = moment(new Date()).format('YYYY-MM-DD')

    if (!userInfo || !number) {
      this.setState({
        disableSubmit: true,
        showNoticebar: true
      })

      return
    }
    else {
      this._updateData(number, startDate, endDate)
    }
  }

  handleStartDateChange = (e) => {
    this.setState({startDate: e.detail.value})
  }

  handleEndDateChange = (e) => {
    this.setState({endDate: e.detail.value})
  }

  handleFlush = () => {
    const userInfo = Taro.getStorageSync('userInfo')
    const number = userInfo && userInfo.number
    const { startDate, endDate } = this.state

    if (new Date(startDate).valueOf() > new Date(endDate).valueOf()) {
      Taro.atMessage({
        'message': '起始日期不能大于结束日期!',
        'type': 'warning'
      })

      return
    }
    else {
      this._updateData(number, startDate, endDate)
    }
  }

  _updateData = (number, startDate, endDate) => {
    Taro.request({
      url: approvedTimesheetsAPI,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({
        'number': number,
        'startDate': startDate,
        'endDate': endDate
      })
    })
      .then(res => {
        if (res.statusCode === 200) {
          const rawData = res.data
          const newData = {}

          for(let item of rawData) {
            if (newData[item.date] === undefined) {
              newData[item.date] = 0
            }
            newData[item.date] += item.calculated_time
          }

          this.setState({ newData })
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
          'type': 'warning',
        })
      })
  }

  render() {
    const { newData } = this.state
    var option

    if (Object.keys(newData).length != 0) {
      option = {
        title: {
          text: '工时图示'
        },
        toolbox: {
          show: true,
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['每日合计工时']
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          data: Object.keys(newData)
        },
        yAxis: {},
        grid: {
          bottom: '100px',
        },
        dataZoom: [{
          type: 'slider',
          start: 10,
          end: 90
        }],
        series: [{
          name: '合计',
          type: 'bar',
          itemStyle : {
				    normal : {
					    label: {
				        show: true,
				        position: 'top',
				        textStyle: {
				          color: 'black'
				        }
				      }
				    },
			    },
          data: Object.values(newData)
        }]
      }
    }
    else {
      option = {}
    }

    return (
      <View className='container'>
        <AtMessage></AtMessage>
        {this.state.showNoticebar ?
         <AtNoticebar icon='volume-plus'>
           您没有登录, 或者没有绑定工号, 无法查看工时记录, 请到帐号管理绑定!
         </AtNoticebar>
         : <AtNoticebar close={true}>
             只显示后台经过审核的合计工时, 图表下方的滑动条可以滑动和缩放图表.
           </AtNoticebar>}
        <Echart option={option} ec={{disableTouch: false}} style={'height: 400px'} ></Echart>
        <View>
          <Picker mode='date' value={this.state.startDate} onChange={this.handleStartDateChange}>
            <View className='picker-list-item'>
              <View className='picker-list-item__label'>起始日期</View>
              <View className='picker-list-item__value'>{this.state.startDate}</View>
            </View>
          </Picker>
        </View>
        <View>
          <Picker mode='date' value={this.state.endDate} onChange={this.handleEndDateChange}>
            <View className='picker-list-item'>
              <View className='picker-list-item__label'>结束日期</View>
              <View className='picker-list-item__value'>{this.state.endDate}</View>
            </View>
          </Picker>
        </View>
        <AtButton type='primary' onClick={this.handleFlush}>请求刷新</AtButton>
      </View>
    )
  }
}
