/* eslint-disable max-len */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { closeClaim, submitClaim } from '../../actions/projectReceiptClaim'
import ProjectReceiptClaimModal from '../../components/projectReceiptClaim/projectReceiptClaimModal'

const mapStateToProps = state => ({
  receiptInfo: state.projectReceiptClaim.receiptInfo,
  receiptClaimContractList: state.projectReceiptClaim.receiptClaimContractList,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    closeClaim,
    submitClaim,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ProjectReceiptClaimModalContainer extends React.Component {
  render() {
    return (
      <div>
        <ProjectReceiptClaimModal {...this.props} />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectReceiptClaimModalContainer))

