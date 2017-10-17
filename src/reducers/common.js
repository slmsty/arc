import caseReducer from './caseReducer'

const common = {
  title: '首页',
}

function setTitle(state, action) {
  return { ...state, title: action.title }
}

export default caseReducer(common, {
  SET_TITLE: setTitle,
})
