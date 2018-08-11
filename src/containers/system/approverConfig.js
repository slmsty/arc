import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ApproverConfig from '../../components/system/approverConfig'
import { queryApproverConfig, saveApprovePerson, queryRegionList, getApproveNodeList } from '../../actions/system'

const mapStateToProps = state => ({
  approveConfigs: state.system.approveConfigs,
  isLoading: state.system.isLoading,
  saveSuccess: state.system.saveSuccess,
  regionList: state.system.regionList,
  approveNodeList: state.system.approveNodeList,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    queryApproverConfig,
    saveApprovePerson,
    queryRegionList,
    getApproveNodeList,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(ApproverConfig)
