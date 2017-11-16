/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { permission } from '../../index'

const SubMenu = Menu.SubMenu

export default class MenuComponent extends React.Component {
  render() {
    const menus = permission.menu ? permission.menu.map((menu) => {
      if (menu.menu && menu.menu.length > 0) {
        const childMenus = menu.menu.map(childMenu => (<Menu.Item key={childMenu.key}><Link to={childMenu.path}><i className={`iconfont ${childMenu.icon}`} />&nbsp;{childMenu.name}</Link></Menu.Item>))
        return (
          <SubMenu key={menu.key} title={<span><i className={`iconfont ${menu.icon}`} />{this.props.collapsed ? '' : (` ${menu.name}`)}</span>}>
            {childMenus}
          </SubMenu>
        )
      }
      return null
    }) : null
    return (
      <Menu
        theme="dark"
        mode="inline"
      >
        {menus}
      </Menu>
    )
  }
}

MenuComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
}
