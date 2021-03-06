import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getReceiptList, reject, openClaim, changeClaimType } from '../../actions/noProjectReceiptClaim'
import NoProjectReceiptClaim from '../../components/noProjectReceiptClaim/noProjectReceiptClaim'

const mapStateToProps = state => ({
  receiptClaimList: state.noProjectReceiptClaim.receiptClaimList,
  receiptClaimListRefresh: state.noProjectReceiptClaim.receiptClaimListRefresh,
  amountTotals: state.noProjectReceiptClaim.amountTotals,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getReceiptList,
    reject,
    openClaim,
    changeClaimType,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class NoProjectReceiptClaimContainer extends React.Component {
  render() {
    return (<NoProjectReceiptClaim {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoProjectReceiptClaimContainer)

