import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getContractList, saveContractSplitInfo } from '../../actions/contractSplit'
import BillingApplication from '../../components/billApplication/billingApplication'

const mapStateToProps = state => ({
  myApply: state.myApply,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getContractList,
    saveContractSplitInfo,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(BillingApplication)
