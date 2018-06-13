/**
 * Created by liangshuang on 18/5/17.
 */
import caseReducer from './../caseReducer'
import { saveAs } from '../../util/downFile'
import moment from 'moment'
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
function exportExcelSuccess(state, action) {
  saveAs(action.files.blob, `${moment().format('YYYY-MM-DD')}-初期数据补录.xlsx`)
  return { ...state }
}

export default caseReducer(billDataInit, {
  GET_BILLDATAINIT_LIST_SUCCESS: getBillDataInitList,
  SAVE_BILLDATAINIT_SUCCESS: saveBillDataInit,
  SHOW_DATA_INIT_MODAL_SUCCESS:showDataInitModal,
  EXPORT_EXCEL_SUCCESS: exportExcelSuccess,
})
