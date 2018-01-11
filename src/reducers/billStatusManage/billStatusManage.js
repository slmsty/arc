/**
 * Created by liangshuang on 17/12/13.
 */
import caseReducer from './../caseReducer'

const billStatusManageData = {
  getBillStatusManageList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getBillStatusDetailList: {
  },
  getBillStatusContractDetailList: {
  },
  getBillStatusBillResultList: {
  },
  myBillStatusManageRefresh: new Date().getTime(),
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
/* function saveContractSplitInfo(state) {
  return { ...state, myContractRefresh: new Date().getTime() }
} */


export default caseReducer(billStatusManageData, {
  GET_BILLSTATUS_LIST_SUCCESS: getBillStatusList,
  GET_BILLSTATUS_DETAIL_LIST_SUCCESS: getBillStatusDetail,
  GET_BILLSTATUS_CONTRACT_LIST_SUCCESS: getBillStatusContractDetail,
  GET_BILLSTATUS_RESULT_SUCCESS: getBillStatusBillResult,
})
