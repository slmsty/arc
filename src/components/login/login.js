import React from 'react'
import './login.less'
import { Input, Button } from 'antd'

export default class Login extends React.Component {
  render() {
    return (
      <div className="login">
        <h1 className="title">ARC应收结算管理系统测试入口</h1>
        <Input placeholder="请输入NT账号" style={{width: '200px'}}/>
        <Button
          className="loginBtn"
          type="primary"
          ghost
          onClick={(v) => this.props.loginByNtAccount(v)}
        >登录</Button>
      </div>
    )
  }
}
