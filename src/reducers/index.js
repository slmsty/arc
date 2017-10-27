import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './user'
import common from './common'
import batchImport from './batchImport'
import projectReceiptClaim from './projectReceiptClaim'
import cbsTurnoverWholenessConfirm from './cbsTurnoverWholenessConfirm'

export default combineReducers({
  user,
  common,
  batchImport,
  projectReceiptClaim,
  cbsTurnoverWholenessConfirm,
  routing: routerReducer, // 整合路由
})
