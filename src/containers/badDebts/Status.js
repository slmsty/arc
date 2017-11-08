import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BadDebtsStatus from '../../components/badDebts/Status'
import * as actions from '../../actions/badDebts/status'

const mapStateToProps = state=>({
  ...state.badDebtsStatus
})

const mapDispatchToProps = dispatch=>({
  ...bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BadDebtsStatus)
