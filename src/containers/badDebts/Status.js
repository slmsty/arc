import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BadDebtsStatus from '../../components/badDebts/Status'
import { Search, SendErp, SendErp2, ResetTitle, UpdateResult } from '../../actions/badDebts/status'
import { cancelApply } from '../../actions/badDebts/cancelApply'
import { myApplyInfo } from '../../actions/myApply'

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
    cancelApply,
    myApplyInfo,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(BadDebtsStatus)
