import caseReducer from './caseReducer'

const system = {
  mailConfig: {
    askContractTo: [],
    askContractCc: [],
    receiptArrivalTo: [],
    receiptArrivalCc: [],
  },
  saveSuccess: false,
}

function getMailConfig(state, action) {
  return { ...state, mailConfig: action.response.mailConfig }
}

function saveMailConfig(state, action) {
  return {
    ...state,
    saveSuccess: true,
  }
}

export default caseReducer(system, {
  GET_MAIL_CONFIG_SUCCESS: getMailConfig,
  SAVE_MAIL_CONFIG_SUCCESS: saveMailConfig,
})
