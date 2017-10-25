import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './user'
import common from './common'
import projectReceiptClaim from './projectReceiptClaim'

export default combineReducers({
  user,
  common,
  projectReceiptClaim,
  routing: routerReducer, // 整合路由
})
