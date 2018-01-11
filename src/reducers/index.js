import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import common from './common'
import batchImport from './batchImport'
import projectReceiptClaim from './projectReceiptClaim'
import noProjectReceiptClaim from './noProjectReceiptClaim'
import reviewReceiptClaim from './reviewReceiptClaim'
import arcCustBankLink from './arcCustBank'
import cbsTurnoverWholenessConfirm from './cbsTurnoverWholenessConfirm'
import manualEntryBankTurnover from './manualEntryBankTurnover'
import contractChange from './contractChange'
import billedARApprove from './billedAR/approve'
import billedARComfirm from './billedAR/confirm'
import badDebtsApply from './badDebts/apply'
import badDebtsStatus from './badDebts/status'
import cancelApply from './badDebts/cancelApply'
import myApply from './myApply'
import contractSplitDara from './constractSplit'
import billApplication from './billApplication'

export default combineReducers({
  common,
  batchImport,
  projectReceiptClaim,
  noProjectReceiptClaim,
  reviewReceiptClaim,
  arcCustBankLink,
  cbsTurnoverWholenessConfirm,
  manualEntryBankTurnover,
  contractChange,
  billedARApprove,
  billedARComfirm,
  badDebtsApply,
  badDebtsStatus,
  myApply,
  contractSplitDara,
  cancelApply,
  billApplication,
  routing: routerReducer, // 整合路由
})
