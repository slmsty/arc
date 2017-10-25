import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setTitle } from '../../actions/common'
import BatchImport from '../../components/manualEntryBankTurnover/batchImport'
import { getImportResultData } from '../../actions/batchImport'


const mapStateToProps = state => ({
  user: state.user,
  successResult: state.successResult,
  failureResult: state.failureResult,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setTitle, getImportResultData,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class BatchImportContainer extends React.Component {
  render() {
    return (<BatchImport {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchImportContainer)

