import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomerTaxInfo from '../../components/system/customerTaxInfo'
import { queryCustTaxInfo, saveCustTaxInfo } from '../../actions/system'

const mapStateToProps = state => ({
  pageInfo: state.system.pageInfo,
  isLoading: state.system.isLoading,
  saveSuccess: state.system.saveSuccess,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    queryCustTaxInfo,
    saveCustTaxInfo,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(CustomerTaxInfo)
