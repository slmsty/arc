import caseReducer from './caseReducer'

const user = {
  accountId: 'accountId',
  accountName: 'accountName',
  ntAccount: 'ntAccount',
}

function getUserInfo(state, action) {
  return {...state, ...action.response.result}
}

export default caseReducer(user, {
  GET_USER_INFO_SUCCESS: getUserInfo,
})
