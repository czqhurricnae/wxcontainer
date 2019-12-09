import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtButton, AtNoticebar, AtMessage } from 'taro-ui'
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
      endDate: moment(new Date()).format('YYYY-MM-DD'),
      showNoticebar: false
    }
  }

  componentDidMount () {
    const userInfo = Taro.getStorageSync('userInfo')
    const number = userInfo && userInfo.number

    if (!userInfo || !number) {
      this.setState({disableSubmit: true,
        showNoticebar: true})
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
      Taro.atMessage({'message': '起始日期不能大于结束日期!', 'type': 'warning'})
      return
    }
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
        <AtMessage></AtMessage>
        {this.state.showNoticebar ?
         <AtNoticebar icon='volume-plus'>
           您没有登录, 或者后台没有您对应的工号, 无法查看工时记录!
         </AtNoticebar>
        : ''}
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
