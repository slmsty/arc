import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import common from './common'
import batchImport from './batchImport'
import projectReceiptClaim from './projectReceiptClaim'
import noProjectReceiptClaim from './noProjectReceiptClaim'
import reviewReceiptClaim from './reviewReceiptClaim'
import arcCustBankLink from './arcCustBank'
import cbsTurnoverWholenessConfirm from './cbsTurnoverWholenessConfirm'
import contractChange from './contractChange'
import billedARApprove from './billedAR/approve'
import billedARComfirm from './billedAR/confirm'

export default combineReducers({
  common,
  batchImport,
  projectReceiptClaim,
  noProjectReceiptClaim,
  reviewReceiptClaim,
  arcCustBankLink,
  cbsTurnoverWholenessConfirm,
  contractChange,
  billedARApprove,
  billedARComfirm,
  routing: routerReducer, // 整合路由
})
