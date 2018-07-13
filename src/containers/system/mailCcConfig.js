import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MailCcConfig from '../../components/system/MailCcConfig'
import { queryMailCcConfig, saveMailCcConfig, queryRegionList } from '../../actions/system'

const mapStateToProps = state => ({
  mailCcConfig: state.system.mailCcConfig,
  regionList: state.system.regionList,
  saveSuccess: state.system.saveSuccess,
  isLoading: state.system.isLoading,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    queryMailCcConfig,
    saveMailCcConfig,
    queryRegionList,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(MailCcConfig)
