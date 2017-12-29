import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { getCBSTurnoverWholenessData, editConfirm, editExcept, initEditData, batchConfirm } from '../../actions/cbsTurnoverWholenessConfirm'
import CBSTurnoverWholenessConfirm from '../../components/cbsTurnoverWholenessConfirm/cbsTurnoverWholenessConfirm'

const mapStateToProps = state => ({
  cbsTurnoverWholenessList: state.cbsTurnoverWholenessConfirm.cbsTurnoverWholenessList,
  cbsTurnoverEditConfirmResult: state.cbsTurnoverWholenessConfirm.cbsTurnoverEditConfirmResult,
  cbsTurnoverEditExceptResult: state.cbsTurnoverWholenessConfirm.cbsTurnoverEditExceptResult,
  initSingleReceiptResult: state.cbsTurnoverWholenessConfirm.initSingleReceiptResult,
  batchConfirmResult: state.cbsTurnoverWholenessConfirm.batchConfirmResult,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getCBSTurnoverWholenessData,
    editConfirm,
    editExcept,
    initEditData,
    batchConfirm,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class CBSTurnoverWholenessConfirmContainer extends React.Component {
  render() {
    return (<CBSTurnoverWholenessConfirm {...this.props} />)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CBSTurnoverWholenessConfirmContainer))

