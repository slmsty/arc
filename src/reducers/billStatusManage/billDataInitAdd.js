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
export default caseReducer(billDataInit, {
  GET_BILLDATAINIT_LIST_SUCCESS: getBillDataInitList,
  SAVE_BILLDATAINIT_SUCCESS: saveBillDataInit,
})
