/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'

const SubMenu = Menu.SubMenu

export default class MenuComponent extends React.Component {
  render() {
    return (
      <Menu theme="dark" mode="inline">
        <SubMenu key="1" title={<span><i className="iconfont icon-huikuanguanli" />&nbsp;<span>回款管理</span></span>}>
          <Menu.Item key="11"><Link to="/cbsTurnoverWholenessConfirm"><i className="iconfont icon-CBS" />&nbsp;CBS流水完整性确认</Link></Menu.Item>
          <Menu.Item key="12"><Link to="/manualEntryBankTurnover"><i className="iconfont icon-rengongluru" />&nbsp;人工录入银行流水</Link></Menu.Item>
          <Menu.Item key="13"><Link to="/receiptManagement/projectReceiptClaim"><i className="iconfont icon-xiangmushoukuan" />&nbsp;项目收款认领</Link></Menu.Item>
          <Menu.Item key="14"><Link to="/receiptManagement/noProjectReceiptClaim"><i className="iconfont icon-feixiangmushoukuan" />&nbsp;非项目收款认领</Link></Menu.Item>
          <Menu.Item key="15"><Link to="/receiptManagement/reviewReceiptClaim"><i className="iconfont icon-shoukuanrenlingfuhe" />&nbsp;收款认领复核</Link></Menu.Item>
        </SubMenu>
        <Menu.Item key="2">
          <i className="iconfont icon-BilledAR" />&nbsp;
          <span>Billed AR管理</span>
        </Menu.Item>
        <Menu.Item key="3">
          <i className="iconfont icon-shijikaipiaoguanli" />&nbsp;
          <span>实际开票管理</span>
        </Menu.Item>
        <Menu.Item key="4">
          <i className="iconfont icon-huaizhangguanli" />&nbsp;
          <span>坏账管理</span>
        </Menu.Item>
      </Menu>
    )
  }
}
