import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtButton } from 'taro-ui'
import MoveChart from '../../components/MoveChart'
import moment from 'moment'

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

  componentDidMount() {
    const chartData = {
      dimensions: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      measures: [{
        data: [10, 52, 200, 334, 390, 330, 220, 334, 390, 330, 220, 10, 52, 200,]
      }]
    }
    this.moveChart.refresh(chartData);
  }

  refMoveChart = (node) => this.moveChart = node

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
    return (
      <View className='container'>
        <View className="move-chart">
          <MoveChart ref={this.refMoveChart} />
        </View>
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
