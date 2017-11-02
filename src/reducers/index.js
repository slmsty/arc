import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import common from './common'
import batchImport from './batchImport'
import projectReceiptClaim from './projectReceiptClaim'
import noProjectReceiptClaim from './noProjectReceiptClaim'
import reviewReceiptClaim from './reviewReceiptClaim'
import cbsTurnoverWholenessConfirm from './cbsTurnoverWholenessConfirm'
import manualEntryBankTurnover from './manualEntryBankTurnover'
import contractChange from './contractChange'

export default combineReducers({
  common,
  batchImport,
  projectReceiptClaim,
  noProjectReceiptClaim,
  reviewReceiptClaim,
  cbsTurnoverWholenessConfirm,
  manualEntryBankTurnover,
  contractChange,
  routing: routerReducer, // 整合路由
})
