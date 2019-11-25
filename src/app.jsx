import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'
import TimeSheet from './pages/timesheet'
import store from './pages/timesheet/store.jsx'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释:
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/tools/index',
      'pages/timesheet/index',
      'pages/authorize/login',
    ],

    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
        <TimeSheet></TimeSheet>
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
