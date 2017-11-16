/* eslint-disable max-len */
// import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import 'normalize.css'
import reduxRequestMiddleware from './http/reduxRequestMiddleware'
import requestJson from './http/requestJson'
import './index.css'
import reducers from './reducers/index'
import IndexContainer from './containers/index'

export const httpRequestJson = requestJson(process.env.REACT_APP_GATEWAY)

export const permission = {
  menu: [
    {
      key: '1',
      path: '/receiptManagement',
      name: '回款管理',
      icon: 'icon-huikuanguanli',
      component: 'HomeContainer',
      menu: [
        {
          key: '11',
          path: '/receiptManagement/cbsTurnoverWholenessConfirm',
          name: 'CBS流水完整性确认',
          icon: 'icon-CBS',
          component: 'CBSTurnoverWholenessConfirm',
        },
        {
          key: '12',
          path: '/receiptManagement/manualEntryBankTurnover',
          name: '人工录入银行流水',
          icon: 'icon-rengongluru',
          component: 'ManualEntryBankTurnover',
          menu: [
            {
              key: '121',
              path: '/receiptManagement/manualEntryBankTurnover/batchImport',
              name: '批量导入',
              component: 'BatchImport',
            },
          ],
        },
        {
          key: '13',
          path: '/receiptManagement/projectReceiptClaim',
          name: '项目收款认领',
          icon: 'icon-xiangmushoukuan',
          component: 'ProjectReceiptClaimContainer',
        },
        {
          key: '14',
          path: '/receiptManagement/noProjectReceiptClaim',
          name: '订单收款认领',
          icon: 'icon-feixiangmushoukuan',
          component: 'NoProjectReceiptClaimContainer',
        },
        {
          key: '15',
          path: '/receiptManagement/reviewReceiptClaim',
          name: '收款认领复核',
          icon: 'icon-shoukuanrenlingfuhe',
          component: 'ReviewReceiptClaimContainer',
        },
        {
          key: '16',
          path: '/receiptManagement/customerBankLink',
          name: '客户银行帐号关系',
          icon: 'icon-shoukuanrenlingfuhe',
          component: 'CustomerBankLinkContainer',
        },
        {
          key: '17',
          path: '/receiptManagement/contractChange',
          name: '合同变更明细',
          icon: 'icon-xiangmushoukuan',
          component: 'ContractChangeContainer',
        },
      ],
    },
    {
      key: '2',
      path: '/billedAR',
      name: 'Billed AR管理',
      icon: 'icon-BilledAR',
      component: 'HomeContainer',
      menu: [
        {
          key: '21',
          path: '/billedAR/approve',
          name: 'Billed AR审定',
          icon: 'icon-BilledAR',
          component: 'BilledARApprove',
        },
        {
          key: '22',
          path: '/billedAR/confirm',
          name: 'Billed AR确认',
          icon: 'icon-BilledAR',
          component: 'BilledARConfirm',
        },
      ],
    },
    {
      key: '3',
      path: '/badDebts',
      name: '坏账管理',
      icon: 'icon-huaizhangguanli',
      component: 'HomeContainer',
      menu: [
        {
          key: '31',
          path: '/badDebts/apply',
          name: '坏账划销申请',
          icon: 'icon-BilledAR',
          component: 'BadDebtsApply',
        },
        {
          key: '32',
          path: '/badDebts/status',
          name: '坏账管理状态',
          icon: 'icon-BilledAR',
          component: 'BadDebtsStatus',
        },
      ],
    },
  ],
}

function loader() {
  const history = createHistory()
  const middleware = [thunk, routerMiddleware(history), reduxRequestMiddleware(httpRequestJson)]
  // see: http://zalmoxisus.github.io/redux-devtools-extension/
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

  const enhancer = composeEnhancers(applyMiddleware(...middleware))

  const store = createStore(reducers, enhancer)

  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <IndexContainer />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  )
}


function bootstrap() {
  if (window.location.hash && window.location.hash.indexOf('access_token=') > -1) {
    window.sessionStorage.setItem('token', `bearer ${window.location.hash.split('access_token=')[1].split('&')[0]}`)
    window.history.pushState(null, '', window.localStorage.getItem('oldUrl'))
    loader()
  } else if (window.sessionStorage.getItem('token')) {
    loader()
  } else {
    window.localStorage.setItem('oldUrl', window.location.href)
    if (!window.location.origin) {
      window.location.origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
    }
    // token不存在 去访问第三方授权网站 （注意：redirect_uri 需要和 后端设置的完全一样）
    window.location.href = `${process.env.REACT_APP_OAUTH2_SERVER}?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=all&redirect_uri=${window.location.origin}${process.env.PUBLIC_URL}`
  }
}

export default bootstrap()
