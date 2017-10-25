import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './user'
import common from './common'
import batchImport from './batchImport'

export default combineReducers({
  user,
  common,
  batchImport,
  routing: routerReducer, // 整合路由
})
