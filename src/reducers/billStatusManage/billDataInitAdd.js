/**
 * Created by liangshuang on 18/5/17.
 */
import caseReducer from './../caseReducer'

const billDataInit = {
  getbillDataInitList: {
    pageNo: 1,
    count: 0,
    pageSize: 10,
    result: [],
  },
  eidiBillDataInit:{
  },
  myContractRefresh: new Date().getTime(),
}
function getBillDataInitList(state, action) {
  return { ...state, getbillDataInitList: action.response.billingDataInitResultPageInfo }
}
function saveBillDataInit(state, action) {
  return {
    ...state, myContractRefresh: new Date().getTime()
  }
}
function showDataInitModal(state, action) {
  return {
    ...state,eidiBillDataInit:action.response
  }
}
export default caseReducer(billDataInit, {
  GET_BILLDATAINIT_LIST_SUCCESS: getBillDataInitList,
  SAVE_BILLDATAINIT_SUCCESS: saveBillDataInit,
  SHOW_DATA_INIT_MODAL_SUCCESS:showDataInitModal
})
