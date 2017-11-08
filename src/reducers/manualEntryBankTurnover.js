import caseReducer from './caseReducer'

const manualEntryBankTurnoverData = {
  manualEntryBankTurnoverList: {
    pageInfo: {
      pageNo: 1,
      count: 0,
      result: [],
    },
  },
  manualEntryBankTurnoverConfirmResult: new Date().getTime(),
  manualEntryBankTurnoverDeleteResult: new Date().getTime(),
  manualEntryBankTurnoverBatchConfirmResult: {
    data: {
      failureNum: 0,
      successNum: 0,
    },
    time: new Date().getTime(),
  },
  manualEntryBankTurnoverBatchDeleteResult: new Date().getTime(),
}

function getManualEntryBankTurnoverData(state, action) {
  return { ...state, manualEntryBankTurnoverList: action.response }
}

function editConfirm(state) {
  return { ...state, manualEntryBankTurnoverConfirmResult: new Date().getTime() }
}

function editDelete(state) {
  return { ...state, manualEntryBankTurnoverDeleteResult: new Date().getTime() }
}

function editBatchConfirm(state, action) {
  return {
    ...state,
    manualEntryBankTurnoverBatchConfirmResult: {
      data: action.response.data,
      time: new Date().getTime(),
    },
  }
}

function editBatchDelete(state) {
  return { ...state, manualEntryBankTurnoverBatchDeleteResult: new Date().getTime() }
}

export default caseReducer(manualEntryBankTurnoverData, {
  GET_MANUAL_ENTRY_BANK_TURNOVER_DATA_SUCCESS: getManualEntryBankTurnoverData,
  CONFIRM_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS: editConfirm,
  DELETE_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS: editDelete,
  CONFIRM_BATCH_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS: editBatchConfirm,
  DELETE_BATCH_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS: editBatchDelete,
})
