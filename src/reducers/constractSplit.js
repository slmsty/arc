/**
 * Created by liangshuang on 17/12/13.
 */
import caseReducer from './caseReducer'

const contactSplitData = {
  getContractList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getUrl: {},
  sendResult: {},
  erpList: [],
  getProductNo: [],
  myContractRefresh: new Date().getTime(),
}

function getContractList(state, action) {
  return { ...state, getContractList: action.response.pageInfo }
}
function saveContractSplitInfo(state) {
  return { ...state, myContractRefresh: new Date().getTime() }
}
function getUrl(state, action) {
  return { ...state, getUrl: action.response.result }
}
function sendErp(state, action) {
  return { ...state, sendResult: action.response.result }
}
function sendERPQuery(state, action) {
  return { ...state, erpList: action.response.pageInfo }
}
function getProductNo(state, action) {
  return { ...state, getProductNo: action.response.pageInfo.result }
}


export default caseReducer(contactSplitData, {
  GET_CONTRACT_LIST_SUCCESS: getContractList,
  SAVE_CONTRACTSPLITINFO_SUCCESS: saveContractSplitInfo,
  GET_URL_SUCCESS:getUrl,
  SENDERP_SUCCESS:sendErp,
  SENDERP_QUERY_SUCCESS:sendERPQuery,
  GETPRODUCTNO_SUCCESS:getProductNo,
})
