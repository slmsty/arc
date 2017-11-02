import caseReducer from './caseReducer'

const common = {
  user: {
    accountId: '',
    staffName: '',
    orgName: '',
    headIcon: '',
  },
}

function getUserInfo(state, action) {
  console.trace()
  return { ...state, user: action.response.staffInfo }
}

function notification(state, action) {
  return { ...state, ...{ notification: action.message } }
}

export default caseReducer(common, {
  NOTIFICATION: notification,
  GET_USER_INFO_SUCCESS: getUserInfo,
})
