import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BillingApplication from '../../components/billApplication/billingApplication'
import { getUrl } from '../../actions/contractSplit'
import * as actions from '../../actions/billApplication'

const mapStateToProps = state => ({
  ...state.billApplication,
  currentUser: state.common.user,
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  getUrl,
})

export default connect(mapStateToProps, mapDispatchToProps)(BillingApplication)
