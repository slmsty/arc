import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BillingApplication from '../../components/billApplication/billingApplication'
import * as actions from '../../actions/billApplication'

const mapStateToProps = state => ({
  ...state.billApplication,
  currentUser: state.common.user,
  role: state.common.permission.role,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    ...actions,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(BillingApplication)
