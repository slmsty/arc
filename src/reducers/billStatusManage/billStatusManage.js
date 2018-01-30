/**
 * Created by liangshuang on 17/12/13.
 */
import caseReducer from './../caseReducer'
import saveFile from './../../util/downFile'

const billStatusManageData = {
  getBillStatusManageList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getBillStatusDetailList: []
  ,
  getBillStatusContractDetailList: []
  ,
  getBillStatusBillResultList: []
  ,
  getFileDownList: {},
  cancelApproveRefresh: new Date().getTime(),
}

function getBillStatusList(state, action) {
  return { ...state, getBillStatusManageList: action.response.pageInfo }
}
function getBillStatusDetail(state, action) {
  return { ...state, getBillStatusDetailList: action.response.data }
}
function getBillStatusContractDetail(state, action) {
  return { ...state, getBillStatusContractDetailList: action.response.data }
}
function getBillStatusBillResult(state, action) {
  return { ...state, getBillStatusBillResultList: action.response.data }
}
function disableApprove(state) {
  return { ...state, cancelApproveRefresh: new Date().getTime() }
}
function cancelApprove(state) {
  return { ...state, cancelApproveRefresh: new Date().getTime() }
}
function sendAP(state) {
  return { ...state, cancelApproveRefresh: new Date().getTime() }
}
function fileDown(state, action) {
  console.log('response',action)
  saveFile(action.response.Blob, '20180129.pdf')
  return { ...state, getFileDownList: action.response.resultDetail }
}

export default caseReducer(billStatusManageData, {
  GET_BILLSTATUS_LIST_SUCCESS: getBillStatusList,
  GET_BILLSTATUS_DETAIL_LIST_SUCCESS: getBillStatusDetail,
  GET_BILLSTATUS_CONTRACT_LIST_SUCCESS: getBillStatusContractDetail,
  GET_BILLSTATUS_RESULT_SUCCESS: getBillStatusBillResult,
  CANCEL_APPROVE_SUCCESS: cancelApprove,
  DISSABLE_APPROVE_SUCCESS: disableApprove,
  SEND_AP_SUCCESS: sendAP,
  FILE_DOWN_SUCCESS: fileDown,
})
