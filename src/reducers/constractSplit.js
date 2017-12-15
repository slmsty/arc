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
  myContractRefresh: new Date().getTime(),
}

function getContractList(state, action) {
  return { ...state, getContractList: action.response.pageInfo }
}
function saveContractSplitInfo(state) {
  return { ...state, myContractRefresh: new Date().getTime() }
}


export default caseReducer(contactSplitData, {
  GET_CONTRACT_LIST_SUCCESS: getContractList,
  SAVE_CONTRACTSPLITINFO_SUCCESS: saveContractSplitInfo,
})
