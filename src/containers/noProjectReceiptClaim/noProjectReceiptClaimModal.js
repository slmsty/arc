/* eslint-disable max-len */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { closeClaim, submitClaim, getOrder } from '../../actions/noProjectReceiptClaim'
import NoProjectReceiptClaimModal from '../../components/noProjectReceiptClaim/noProjectReceiptClaimModal'

const mapStateToProps = state => ({
  receiptInfo: state.noProjectReceiptClaim.receiptInfo,
  receiptClaimOrderList: state.noProjectReceiptClaim.receiptClaimOrderList,
  getOrderCompleted: state.noProjectReceiptClaim.getOrderCompleted,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    closeClaim,
    submitClaim,
    getOrder,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class NoProjectReceiptClaimModalContainer extends React.Component {
  render() {
    return (
      <div>
        <NoProjectReceiptClaimModal {...this.props} />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NoProjectReceiptClaimModalContainer))

