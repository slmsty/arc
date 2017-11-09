/* eslint-disable max-len */
import caseReducer from './caseReducer'

const common = {
  user: {
    accountId: '',
    staffName: '',
    orgName: '',
    headIcon: '',
  },
  error: {
    message: '',
    timeTick: new Date().getTime(),
  },
}

function getUserInfo(state, action) {
  return { ...state, user: action.response.staffInfo }
}

function showFailure(state, action) {
  return { ...state, error: { message: action.response.resultMessage, timeTick: new Date().getTime() } }
}

function showError(state, action) {
  return { ...state, error: { message: action.error.statusText, timeTick: new Date().getTime() } }
}

export default caseReducer(common, {
  GET_USER_INFO_SUCCESS: getUserInfo,
  HTTP_FAILURE: showFailure,
  HTTP_ERROR: showError,
})
