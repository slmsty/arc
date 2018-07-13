import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BigSignAudit from '../../components/billApplication/bigSignAudit'
import { billStartWorkFlow, searchContractBilling, getApplicationDetail } from '../../actions/billApplication'
import { billApproveSave } from '../../actions/myApply'

const mapStateToProps = state => ({
  billContracts: state.billApplication.billContracts,
  searchLoading: state.billApplication.searchLoading,
  applicationInfo: state.billApplication.applicationInfo,
  billStartSuccess: state.billApplication.billStartSuccess,
  currentUser: state.common.user,
  role: state.common.permission.role,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    billStartWorkFlow,
    searchContractBilling,
    getApplicationDetail,
    billApproveSave,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(BigSignAudit)
