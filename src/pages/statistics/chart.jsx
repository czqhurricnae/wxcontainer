import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtButton, AtNoticebar, AtMessage, AtToast } from 'taro-ui'
import { ClSelect } from 'mp-colorui'
import moment from 'moment'
import Echart from 'echarts12'
import _ from 'lodash'
import { teamsAPI, statisticsAPI } from '@constants/api'

import "./chart.scss";

export default class Chart extends Component {
  constructor() {
    super(...arguments)
    const date = new Date()

    this.state = {
      year: date.getFullYear(),
      month: date.getMonth(),
      teams: [],
      teamMaps: [],
      teamID: '',
      showNoticebar: false,
      rawData: []
    }
  }

  componentDidMount () {
    const userInfo = Taro.getStorageSync('userInfo')
    const number = userInfo && userInfo.number

    if (!userInfo || !number) {
      this.setState({
        disableSubmit: true,
        showNoticebar: true,
        showToast: false,
        toastText: ''
      })

      return
    }
    else {
      Taro.request({ url: teamsAPI, method: 'GET' })
        .then(res => {
          if (res.statusCode === 200) {
            const teams = Object.values(res.data)
            const teamMaps = _.invert(res.data)

            this.setState({
              teams,
              teamMaps,
              showToast: false,
              toastText: ''
            })
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
  }

  handleChangeMonth = (value) => {
    const monthMaps = [_.range(2019, 9999, 1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]
    const rawYear = monthMaps[0][value[0]]
    const rawMonth = monthMaps[1][value[1]]

    this.setState({
      year: rawYear,
      month: rawMonth-1,
      showToast: false,
      toastText: ''
    })
  }

  handleSelectTeam = (e) => {
    const teamChecked = this.state.teams[e.detail.value]
    const teamID = this.state.teamMaps[teamChecked]

    this.setState({
      teamChecked,
      teamID,
      showToast: false,
      toastText: ''
    })
  }

  handleFlush = () => {
    const { year, month, teamID } = this.state
    const yearAndMonth = moment(new Date(year, month)).format('YYYY-MM')

    if (teamID == '') {
      Taro.atMessage({
        'message': '请先选择一个班组!',
        'type': 'warning'
      })

      return
    }
    else {
      this._updateData(teamID, yearAndMonth)
    }
  }

  _updateData = (teamID, yearAndMonth) => {
    Taro.request({
      url: statisticsAPI,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({
        'teamID': teamID,
        'yearAndMonth': yearAndMonth
      })
    })
      .then(res => {
        if (res.statusCode === 200) {
          const rawData = res.data

          if (!rawData) {
            this.setState({
              showToast: true,
              toastText: '从后台获取班组工时月份统计数据为空.'
            })
          }
          else {
            this.setState({
              rawData,
              showToast: false,
              toastText: ''
            })
          }
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

  render() {
    const {
      year,
      month,
      rawData,
      disableSubmit,
      teams,
      teamChecked,
      showToast,
      toastText} = this.state
    const monthMaps = [_.range(2019, 9999, 1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]
    const initialValue = [year-2019, month]
    var option

    if (rawData && Object.keys(rawData).length > 0) {
      const kinds = {
        'times_of_miscellaneousness': '车间杂项',
        'times_of_no_schedules': '非例行排故',
        'times_of_others': '其他',
        'times_of_schedules': '例行',
        'times_of_services': '勤务'
      }

      const legendData = Object.values(kinds)
      const xAxisData = new Array()
      const seriesData = {'times_of_month':
                          {
                            name:'总工时',
                            type: 'bar',
                            data:[],
                            barGap: '-100%',         // 左移100%,stack不再与上面两个在一列
                            label: {
                              normal: {
                                show: true,
                                position: 'top',       //  位置设为top
                                formatter: '{c}',
                                textStyle: { color: '#000' }
                              }
                            },
                            itemStyle: {
                              normal: {
                                color: 'rgba(128, 128, 128, 0)'    // 仍为透明
                              }
                            }
                          }
                         }

      for (let i = 0; i < rawData.length; i++) {
        xAxisData.push(rawData[i].name)
        for (let j = 0; j < Object.keys(kinds).length; j++) {
          if (seriesData[Object.keys(kinds)[j]] === undefined) {
            seriesData[Object.keys(kinds)[j]] = {
              name: kinds[Object.keys(kinds)[j]],
              type: 'bar',
              stack: '总工时',
              data: new Array()
            }
          }
          seriesData[Object.keys(kinds)[j]].data.push(rawData[i][Object.keys(kinds)[j]])
        }
        seriesData['times_of_month'].data.push(rawData[i]['times_of_month'])
      }

      option = {
        toolbox: {
          show: true,
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          data: xAxisData
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
        series: Object.values(seriesData)
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
        <View className="doc-body">
          <Picker mode='selector' range={teams} onChange={this.handleSelectTeam}>
            <View className='picker__item'>
              <View className='picker__item__label'>
                请选择班组
              </View>
              <View className='picker__item__value'>
                {teamChecked}
              </View>
            </View>
          </Picker>
          <ClSelect
            title='选择月份'
            multiSelector={{range: monthMaps, value: initialValue}}
            mode='multiSelector'
            onChange={this.handleChangeMonth}>
          </ClSelect>
          <AtButton
            type='primary'
            onClick={this.handleFlush}
            disabled={disableSubmit}>
            请求刷新
          </AtButton>
        </View>
        <AtToast
          isOpened={showToast}
          text={toastText}
          duration={1000}
        >
        </AtToast>
      </View>
    )
  }
}
