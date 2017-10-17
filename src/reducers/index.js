import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './user'
import common from './common'

export default combineReducers({
  user,
  common,
  routing: routerReducer, // 整合路由
})
