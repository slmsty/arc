/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Menu } from 'antd'

const SubMenu = Menu.SubMenu

export default class MenuComponent extends React.Component {
  render() {
    return (
      <Menu
        theme="dark"
        mode="inline"
      >
        <SubMenu key="1" title={<span><i className="iconfont icon-huikuanguanli" />{this.props.collapsed ? '' : ' 回款管理'}</span>}>
          <Menu.Item key="11"><Link to="/receiptManagement/cbsTurnoverWholenessConfirm"><i className="iconfont icon-CBS" />&nbsp;CBS流水完整性确认</Link></Menu.Item>
          <Menu.Item key="12"><Link to="/receiptManagement/manualEntryBankTurnover"><i className="iconfont icon-rengongluru" />&nbsp;人工录入银行流水</Link></Menu.Item>
          <Menu.Item key="13"><Link to="/receiptManagement/projectReceiptClaim"><i className="iconfont icon-xiangmushoukuan" />&nbsp;项目收款认领</Link></Menu.Item>
          <Menu.Item key="17"><Link to="/receiptManagement/contractChange"><i className="iconfont icon-xiangmushoukuan" />&nbsp;合同变更明细</Link></Menu.Item>
          <Menu.Item key="14"><Link to="/receiptManagement/noProjectReceiptClaim"><i className="iconfont icon-feixiangmushoukuan" />&nbsp;订单收款认领</Link></Menu.Item>
          <Menu.Item key="15"><Link to="/receiptManagement/reviewReceiptClaim"><i className="iconfont icon-shoukuanrenlingfuhe" />&nbsp;收款认领复核</Link></Menu.Item>
          <Menu.Item key="16"><Link to="/receiptManagement/customerBankLink"><i className="iconfont icon-shoukuanrenlingfuhe" />&nbsp;客户银行帐号关系</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="2" title={<span><i className="iconfont icon-BilledAR" />{this.props.collapsed ? '' : ' Billed AR管理'}</span>}>
          <Menu.Item key="21"><Link to="/billedAR/approve"><i className="iconfont icon-BilledAR" />&nbsp;Billed AR审定</Link></Menu.Item>
          <Menu.Item key="22"><Link to="/billedAR/confirm"><i className="iconfont icon-BilledAR" />&nbsp;Billed AR确认</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="3" title={<span><i className="iconfont icon-huaizhangguanli" />{this.props.collapsed ? '' : ' 坏账管理'}</span>}>
          <Menu.Item key="31"><Link to="/badDebts/apply"><i className="iconfont icon-BilledAR" />&nbsp;坏账划销申请</Link></Menu.Item>
          <Menu.Item key="32"><Link to="/badDebts/status"><i className="iconfont icon-BilledAR" />&nbsp;坏账管理状态</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="4" title={<span><i className="iconfont icon-shijikaipiaoguanli" />{this.props.collapsed ? '' : ' 实际开票管理'}</span>}>
          <Menu.Item key="41">
            <i className="iconfont icon-shijikaipiaoguanli" />&nbsp;
            <span>实际开票管理</span>
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

MenuComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
}
