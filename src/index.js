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
    window.location.href = `${process.env.REACT_APP_OAUTH2_SERVER}?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=all&redirect_uri=${window.location.origin}/`
  }
}

export default bootstrap()
