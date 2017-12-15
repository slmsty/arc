import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BadDebtsStatus from '../../components/badDebts/Status'
import { Search, SendErp, SendErp2, ResetTitle, UpdateResult } from '../../actions/badDebts/status'
import { cancelApply } from '../../actions/badDebts/cancelApply'

const mapStateToProps = state => ({
  ...state.badDebtsStatus,
  myApply: state.myApply,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    Search,
    SendErp,
    SendErp2,
    ResetTitle,
    UpdateResult,
    cancelApply,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(BadDebtsStatus)
