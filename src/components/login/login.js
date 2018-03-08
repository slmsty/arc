import React from 'react'
import './login.less'
import { Input, Button, message } from 'antd'
import 'whatwg-fetch'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accountId: ''
    }
  }
  login = () => {
    const that = this
    fetch(`${process.env.REACT_APP_GATEWAY}v1.0.0/arc/out/getTokenByAccountId/${this.state.accountId}`, {
      method: 'GET',
    }).then(response => {
      return response.json()
    }).then(function(json) {
       if(json.resultCode === '000000') {
         message.success('登录成功')
         sessionStorage.setItem('token', `bearer ${json.data}`)
         that.props.getUserInfo()
         that.props.getPermission()
         that.props.history.push('/')
       }
    })
  }
  render() {
    return (
      <div className="login">
        <h1 className="title">ARC应收结算管理系统测试入口</h1>
        <label>AccountId:</label>
        <Input
          placeholder="请输入AccountId"
          style={{width: '200px'}}
          onChange={(e) => {this.setState({accountId: e.target.value})}}
        />
        <Button
          className="loginBtn"
          type="primary"
          ghost
          onClick={() => this.login()}
        >登录</Button>
      </div>
    )
  }
}
