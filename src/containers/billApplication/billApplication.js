import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BillingApplication from '../../components/billApplication/billingApplication'
import * as actions from '../../actions/billApplication'
import { billApplySave } from '../../actions/myApply'

const mapStateToProps = state => ({
  ...state.billApplication,
  currentUser: state.common.user,
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...actions,
    billApplySave,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(BillingApplication)
