/**
 * Created by liangshuang on 17/12/15.
 */
import caseReducer from '../caseReducer'

const cancelApplyData = {
  getTaskDetail: {
  },
  getMyApplyInfo: {},
  cancelApplyRefresh: new Date().getTime(),
}

function cancelApply(state, action) {
  return { ...state, cancelApplyRefresh: action.response.pageInfo }
}


export default caseReducer(cancelApplyData, {
  UNDOERP_SUCCESS: cancelApply,
})
