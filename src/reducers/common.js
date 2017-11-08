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
  return { ...state, user: action.response.staffInfo }
}

export default caseReducer(common, {
  GET_USER_INFO_SUCCESS: getUserInfo,
})
