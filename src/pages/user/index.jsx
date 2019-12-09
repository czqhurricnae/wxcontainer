import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtButton } from 'taro-ui'
import MoveChart from '../../components/MoveChart'
import moment from 'moment'
import Echart from 'echarts12'

import "./index.scss";


export default class Move extends Component {
  config = {
    navigationBarTitleText: "工时表"
  };

  constructor() {
    super(...arguments)
    const date = new Date()

    this.state = {
      startDate:moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD')
    }
  }

  handleStartDateChange = () => {
    this.setState({startDate: e.detail.value})
  }

  handleEndDateChange = () => {
    this.setState({endDate: e.detail.value})
  }

  handleFlush = () => {
    const userInfo = Taro.getStorageSync('userInfo')
    const number = userInfo && userInfo.number

    console.log(number, this.state.startDate, this.state.endDate)
  }

  render() {
    const option = {
      color: ['#3398DB'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {        // 坐标轴指示器,坐标轴触发有效
          type : 'shadow'      // 默认为直线,可选为:'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'直接访问',
          type:'bar',
          barWidth: '60%',
          data:[10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }

    return (
      <View className='container'>
        <Echart option={option} ec={{disableTouch: false}} style={'height: 400px'} ></Echart>
        <View>
          <Picker mode='date' value={this.state.startDate} onChange={this.handleStartDateChange}>
            <View className='picker-list-item'>
              <View className='picker-list-item__label'>开始日期</View>
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
