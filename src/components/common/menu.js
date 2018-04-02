/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Menu } from 'antd'

const SubMenu = Menu.SubMenu
//sessionStorage.setItem('permissionBtns', childMenu.child)
export default class MenuComponent extends React.Component {
  render() {
    const menus = this.props.menu ? this.props.menu.map((menu) => {
      if (menu.child && menu.child.length > 0) {
        const childMenus = menu.child.map(childMenu => (
          <Menu.Item key={childMenu.key}>
            <Link to={childMenu.path} onClick={() => sessionStorage.setItem('roleButtons', childMenu.child)}>
              <i className={`iconfont ${childMenu.icon}`} />&nbsp;{childMenu.name}</Link>
          </Menu.Item>)
        )
        return (
          <SubMenu
            key={menu.key}
            title={<span><i className={`iconfont ${menu.icon}`} />{this.props.collapsed ? '' : (` ${menu.name}`)}</span>}
            onClick={() => {console.log()}}
          >
            {childMenus}
          </SubMenu>
        )
      }if(!menu.child){
        const Menus =<Menu.Item key={menu.key}><Link to={menu.path} style={{fontSize:'16px'}}><i className={`iconfont ${menu.icon}`} />&nbsp;{menu.name}</Link></Menu.Item>
        return Menus
      }

      return null
    }) : null
    return (
      <Menu
        theme="dark"
        mode="inline"
        className="m-menu"
      >
        {menus}
      </Menu>
    )
  }
}

MenuComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  menu: PropTypes.arrayOf(PropTypes.shape()),
}
