import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomerContent from '../../components/system/customerContent'
import { queryInvoiceTaxInfo, saveInvoiceTaxInfo } from '../../actions/system'

const mapStateToProps = state => ({
  taxPageInfo: state.system.taxPageInfo,
  isLoading: state.system.isLoading,
  saveSuccess: state.system.saveSuccess,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    queryInvoiceTaxInfo,
    saveInvoiceTaxInfo,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(CustomerContent)
