import caseReducer from './caseReducer'

const myApplyInfoData = {
  getMyApplyList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getMyApplyInfo: {},
  getReturnEditInfo: {},
  myapplyListRefresh: new Date().getTime(),
  billSaveSuccess: false,
  applicationIds: [],
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
function returnEditClim(state, action) {
  return { ...state, getReturnEditInfo: action.response.data }
}
function returnEditSendErp(state) {
  return { ...state, myapplyListRefresh: new Date().getTime() }
}
function BillStatusSendErp(state) {
  return { ...state, myapplyListRefresh: new Date().getTime() }
}
function cancelApply(state) {
  return { ...state, myapplyListRefresh: new Date().getTime() }
}
function billApplySave(state, action) {
  return {
    ...state,
    billSaveSuccess: true,
    applicationIds: action.response.data,
  }
}

export default caseReducer(myApplyInfoData, {
  GET_MYAPPLY_LIST_SUCCESS: getMyApplyList,
  APPROVE_MYAPPLY_SUCCESS: approveSubmit,
  APPROVE_REJECT_MYAPPLY_SUCCESS: approveReject,
  APPROVE_MYAPPLYINFO_SUCCESS: myApplyInfo,
  RETURNEDITCLIM_SUCCESS: returnEditClim,
  RETURNEDITSENDERP_SUCCESS: returnEditSendErp,
  BILLSTATUSSENDERP_SUCCESS: BillStatusSendErp,
  UNDOERP_SUCCESS: cancelApply,
  BILL_APPLY_SAVE_SUCCESS: billApplySave,
})
