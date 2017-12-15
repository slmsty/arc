import caseReducer from './caseReducer'

const myApplyInfoData = {
  getMyApplyList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getMyApplyInfo: {},
  myapplyListRefresh: new Date().getTime(),
}

function getMyApplyList(state, action) {
  return { ...state, getMyApplyList: action.response.pageInfo }
}
function approveSubmit(state) {
  return { ...state, myapplyListRefresh: new Date().getTime() }
}
function approveReject(state) {
  return { ...state, myapplyListRefresh: new Date().getTime() }
}
function myApplyInfo(state, action) {
  return { ...state, getMyApplyInfo: action.response.data }
}

export default caseReducer(myApplyInfoData, {
  GET_MYAPPLY_LIST_SUCCESS: getMyApplyList,
  APPROVE_MYAPPLY_SUCCESS: approveSubmit,
  APPROVE_REJECT_MYAPPLY_SUCCESS: approveReject,
  APPROVE_MYAPPLYINFO_SUCCESS: myApplyInfo,
})
