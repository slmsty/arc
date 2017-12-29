import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BadDebtsStatus from '../../components/badDebts/Status'
import { Search, SendErp, SendErp2, ResetTitle, UpdateResult } from '../../actions/badDebts/status'
import { myApplyInfo, returnEditClim, returnEditSendErp, BillStatusSendErp, cancelApply } from '../../actions/myApply'

const mapStateToProps = state => ({
  myApply: state.myApply,
  ...state.badDebtsStatus,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    Search,
    SendErp,
    SendErp2,
    ResetTitle,
    UpdateResult,
    myApplyInfo,
    returnEditClim,
    returnEditSendErp,
    BillStatusSendErp,
    cancelApply,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(BadDebtsStatus)
