import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomerContent from '../../components/system/customerContent'
import * as actions from '../../actions/system'

const mapStateToProps = state => ({
  ...state.system,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    ...actions,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(CustomerContent)
