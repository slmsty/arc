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

export default caseReducer(contactSplitData, {
  GET_CONTRACT_LIST_SUCCESS: getContractList,
  SAVE_CONTRACTSPLITINFO_SUCCESS: saveContractSplitInfo,
  GET_URL_SUCCESS:getUrl,
})
