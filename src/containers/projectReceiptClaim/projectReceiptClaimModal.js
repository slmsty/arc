/* eslint-disable max-len */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { closeClaim, submitClaim, getPhase } from '../../actions/projectReceiptClaim'
import ProjectReceiptClaimModal from '../../components/projectReceiptClaim/projectReceiptClaimModal'

const mapStateToProps = state => ({
  receiptInfo: state.projectReceiptClaim.receiptInfo,
  receiptClaimFundList: state.projectReceiptClaim.receiptClaimFundList,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    closeClaim,
    submitClaim,
    getPhase,
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

