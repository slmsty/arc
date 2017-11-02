import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BilledARConfirm from '../../components/billedAR/Confirm'
import * as actions from '../../actions/billedAR/approve'

const mapStateToProps = state=>({
  ...state.billedARComfirm
})

const mapDispatchToProps = dispatch=>({
  ...bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BilledARConfirm)
