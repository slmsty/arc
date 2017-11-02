import caseReducer from './caseReducer'

const arcCustBankData = {
  getBankLinkList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
}

function getArcCustBankList(state, action) {
  // console.log('action', action)
  return { ...state, getBankLinkList: action.response.data }
}
function addArcCustBankData(state, action) {
  // console.log('action', action)
  return { ...state, ...action.response }
}
function deleteArcCustBankData(state, action) {
  console.log('action', action)
  return { ...state, ...action.response }
}
function deleteArcCustBankDatas(state, action) {
  // console.log('action', action)
  return { ...state, ...action.response }
}
export default caseReducer(arcCustBankData, {
  GET_ARC_CUSTBANK_LIST_SUCCESS: getArcCustBankList,
  ADD_ARC_CUSTBANK_DATA_SUCCESS: addArcCustBankData,
  DELETE_ARC_CUSTBANK_DATA_SUCCESS: deleteArcCustBankData,
  DELETE_ARC_CUSTBANK_DATAS_SUCCESS: deleteArcCustBankDatas,
})
