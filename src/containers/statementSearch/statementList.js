import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import StatementListCom from '../../components/statementSearch/statementList'
import { getReviewReceiptList, approveSubmit, returnReceiptClaim, transferReceiptClaim } from '../../actions/reviewReceiptClaim'

const mapStateToProps = state => ({
  reviewReceiptClaim: state.reviewReceiptClaim,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getReviewReceiptList,
    approveSubmit,
    returnReceiptClaim,
    transferReceiptClaim,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class StatementListContainer extends React.Component {
  render() {
    return (<StatementListCom {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatementListContainer)

