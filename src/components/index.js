/* eslint-disable react/forbid-prop-types,global-require */
import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Layout, Icon, Breadcrumb } from 'antd'
import MenuComponent from './common/menu'
import './index.css'

const { Header, Sider, Content } = Layout

const breadcrumbNameMap = {
  '/receiptManagement': '回款管理',
  '/receiptManagement/projectReceiptClaim': '项目收款认领',
  '/receiptManagement/noProjectReceiptClaim': '非项目收款认领',
  '/receiptManagement/reviewReceiptClaim': '收款认领复核',
  '/receiptManagement/customerBankLink': '客户银行帐号关系',
  '/receiptManagement/contractChange': '合同变更明细',
  '/receiptManagement/cbsTurnoverWholenessConfirm': 'CBS流水完整性确认',
  '/receiptManagement/manualEntryBankTurnover': '人工录入银行流水',
  '/receiptManagement/manualEntryBankTurnover/batchImport': '批量导入',
  '/billedAR': 'Billed AR管理',
  '/billedAR/approve': 'Billed AR审定',
  '/billedAR/confirm': 'Billed AR确认',
  '/badDebts': '坏账管理',
  '/badDebts/apply': '坏账划销申请',
  '/badDebts/status': '坏账管理状态',
  '/apps/2': 'Application2',
  '/apps/1/detail': 'Detail',
  '/apps/2/detail': 'Detail',
}

const BreadcrumbContainer = withRouter((props) => {
  const { location } = props
  const pathSnippets = location.pathname.split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>
          {breadcrumbNameMap[url]}
        </Link>
      </Breadcrumb.Item>
    )
  })
  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Link to="/">首页</Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems)
  return (
    <div style={{ float: 'left' }}>
      <Breadcrumb>
        {breadcrumbItems}
      </Breadcrumb>
    </div>
  )
})

export default class Index extends React.Component {
  state = {
    collapsed: false,
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  render() {
    const logo = this.state.collapsed ? require('../assets/images/logomini.png') : require('../assets/images/logo.png')
    const { staffName, orgName, headIcon } = this.props.user
    return (
      <Layout style={{ height: '100%' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className={`logo ${this.state.collapsed ? 'logo-mini' : ''}`}>
            <img src={logo} alt="" />
          </div>
          <MenuComponent
            collapsed={this.state.collapsed}
          />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <BreadcrumbContainer />
            <div className="user">
              <img src={headIcon} alt="" />
              <p>欢迎您，<span>{staffName}</span><span>{orgName}</span></p>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            { this.props.children }
          </Content>
        </Layout>
      </Layout>
    )
  }
}
Index.defaultProps = {
  children: '',
}
Index.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({
    staffName: PropTypes.string.isRequired,
    orgName: PropTypes.string.isRequired,
    headIcon: PropTypes.string.isRequired,
  }).isRequired,
}
