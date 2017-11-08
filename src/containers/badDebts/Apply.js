import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BadDebtsApply from '../../components/badDebts/Apply'
import * as actions from '../../actions/badDebts/apply'

const mapStateToProps = state=>({
  ...state.badDebtsApply
})

const mapDispatchToProps = dispatch=>({
  ...bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BadDebtsApply)
