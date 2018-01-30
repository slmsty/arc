import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BatchImport from '../../components/manualEntryBankTurnover/batchImport'
import { getImportResultData, initData, fileDown, importErrorFileDownload } from '../../actions/batchImport'


const mapStateToProps = state => ({
  successResult: state.batchImport.successResult,
  failureResult: state.batchImport.failureResult,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getImportResultData,
    initData,
    fileDown,
    importErrorFileDownload,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class BatchImportContainer extends React.Component {
  render() {
    return (<BatchImport {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchImportContainer)

