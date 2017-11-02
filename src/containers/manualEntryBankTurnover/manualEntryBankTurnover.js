import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { getManualEntryBankTurnoverList, confirmManualEntryBankTurnover, deleteManualEntryBankTurnover, confirmBatchManualEntryBankTurnover, deleteBatchManualEntryBankTurnover } from '../../actions/manualEntryBankTurnover'
import ManualEntryBankTurnover from '../../components/manualEntryBankTurnover/manualEntryBankTurnover'

const mapStateToProps = state => ({
  manualEntryBankTurnoverList: state.manualEntryBankTurnover.manualEntryBankTurnoverList,
  manualEntryBankTurnoverConfirmResult: state.manualEntryBankTurnover.manualEntryBankTurnoverConfirmResult,
  manualEntryBankTurnoverDeleteResult: state.manualEntryBankTurnover.manualEntryBankTurnoverDeleteResult,
  manualEntryBankTurnoverBatchConfirmResult: state.manualEntryBankTurnover.manualEntryBankTurnoverBatchConfirmResult,
  manualEntryBankTurnoverBatchDeleteResult: state.manualEntryBankTurnover.manualEntryBankTurnoverBatchConfirmResult,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getManualEntryBankTurnoverList,
    confirmManualEntryBankTurnover,
    deleteManualEntryBankTurnover,
    confirmBatchManualEntryBankTurnover,
    deleteBatchManualEntryBankTurnover,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ManualEntryBankTurnoverContainer extends React.Component {
  render() {
    return (<ManualEntryBankTurnover {...this.props} />)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManualEntryBankTurnoverContainer))

