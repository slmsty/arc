import caseReducer from './caseReducer'

const arcCustBankData = {
  getBankLinkList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  receiptClaimListRefresh: new Date().getTime(),
}

function getArcCustBankList(state, action) {
  // console.log('action', action)
  return { ...state, getBankLinkList: action.response.data }
}
function addArcCustBankData(state) {
  // console.log('action', action)
  // return { ...state, ...action.response }
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}
function deleteArcCustBankData(state) {
  // console.log('action', action)
  // return { ...state, ...action.response }
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}
function deleteArcCustBankDatas(state) {
  // console.log('action', action)
  // return { ...state, ...action.response }
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}
export default caseReducer(arcCustBankData, {
  GET_ARC_CUSTBANK_LIST_SUCCESS: getArcCustBankList,
  ADD_ARC_CUSTBANK_DATA_SUCCESS: addArcCustBankData,
  DELETE_ARC_CUSTBANK_DATA_SUCCESS: deleteArcCustBankData,
  DELETE_ARC_CUSTBANK_DATAS_SUCCESS: deleteArcCustBankDatas,
})
