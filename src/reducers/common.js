import caseReducer from './caseReducer'

const common = {
}

function notification(state, action) {
  return { ...state, ...{ notification: action.message } }
}

export default caseReducer(common, {
  NOTIFICATION: notification,
})
