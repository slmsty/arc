/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

const SubMenu = Menu.SubMenu

export default class MenuComponent extends React.Component {
  render() {
    return (
      <Menu theme="dark" mode="inline">
        <SubMenu key="1" title={<span><Icon type="mail" /><span>回款管理</span></span>}>
          <Menu.Item key="11"><Link to="/cbsTurnoverWholenessConfirm"><Icon type="user" />CBS流水完整性确认</Link></Menu.Item>
          <Menu.Item key="12"><Link to="/manualEntryBankTurnover"><Icon type="user" />人工录入银行流水</Link></Menu.Item>
          <Menu.Item key="13"><Link to="/receiptManagement/projectReceiptClaim"><Icon type="user" />项目收款认领</Link></Menu.Item>
          <Menu.Item key="14"><Link to="/receiptManagement/noProjectReceiptClaim"><Icon type="user" />非项目收款认领</Link></Menu.Item>
          <Menu.Item key="15"><Link to="/receiptManagement/reviewReceiptClaim"><Icon type="user" />收款认领复核</Link></Menu.Item>
        </SubMenu>
        <Menu.Item key="2">
          <Icon type="user" />
          <span>Billed AR管理</span>
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="video-camera" />
          <span>实际开票管理</span>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="upload" />
          <span>坏账管理</span>
        </Menu.Item>
      </Menu>
    )
  }
}
