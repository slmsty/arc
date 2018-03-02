/* eslint-disable react/forbid-prop-types,global-require */
import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Layout, Icon, Breadcrumb, Menu, Dropdown } from 'antd'
import MenuComponent from './common/menu'
import './index.less'

const { Header, Sider, Content } = Layout

const getBreadcrumbName = (menus, url) => {
  let menuName = ''
  if (menus && menus.length > 0) {
    menus.forEach((menu) => {
      if (menu.path === url) {
        menuName = menu.name
      }
      if (!menuName) {
        menuName = getBreadcrumbName(menu.child, url)
      }
    })
  }
  return menuName
}

const BreadcrumbContainer = withRouter((props) => {
  const { location, permission } = props
  const pathSnippets = location.pathname.split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>
          {getBreadcrumbName(permission.menu, url)}
        </Link>
      </Breadcrumb.Item>
    )
  })
  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Link to="/">ARC.应收结算</Link>
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
    const { accountName, orgName, headIcon } = this.props.user
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
            menu={this.props.permission.menu}
          />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <BreadcrumbContainer
              permission={this.props.permission}
            />
            <div className="user">
              <img src={headIcon} alt="" />
              <p>
                欢迎您，<span>{accountName}</span><span>{orgName}</span>
                <a target="_blank" rel="noopener noreferrer" href="https://xin.asiainfo.com/chat/G6ADE805AC1549359DDB3D803E18E442">问题反馈</a>
              </p>
            </div>
          </Header>
          <Content style={{ margin: '8px 8px', padding: 12, background: '#fff' }}>
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
    accountName: PropTypes.string.isRequired,
    orgName: PropTypes.string,
    headIcon: PropTypes.string.isRequired,
  }).isRequired,
  permission: PropTypes.shape({
    menu: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
}
