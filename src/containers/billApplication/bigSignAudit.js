import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BigSignAudit from '../../components/billApplication/bigSignAudit'
import { billStartWorkFlow, searchContractBilling, getApplicationDetail, getContractUrl } from '../../actions/billApplication'
import { billApproveSave } from '../../actions/myApply'

const mapStateToProps = state => ({
  billContracts: state.billApplication.billContracts,
  searchLoading: state.billApplication.searchLoading,
  applicationInfo: state.billApplication.applicationInfo,
  billStartSuccess: state.billApplication.billStartSuccess,
  currentUser: state.common.user,
  role: state.common.permission.role,
  contractUrl: state.billApplication.contractUrl,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    billStartWorkFlow,
    searchContractBilling,
    getApplicationDetail,
    billApproveSave,
    getContractUrl,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(BigSignAudit)
