import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BilledARApprove from '../../components/billedAR/Approve'
import * as actions from '../../actions/billedAR/approve'

const mapStateToProps = state=>({
  ...state.billedARApprove
})

const mapDispatchToProps = dispatch=>({
  ...bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BilledARApprove)
