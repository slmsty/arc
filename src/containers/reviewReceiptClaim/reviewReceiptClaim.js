import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReviewReceiptClaim from '../../components/reviewReceiptClaim/reviewReceiptClaim'
import { getReviewReceiptList, approveSubmit } from '../../actions/reviewReceiptClaim'

const mapStateToProps = state => ({
  reviewReceiptClaim: state.reviewReceiptClaim,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getReviewReceiptList,
    approveSubmit,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ReviewReceiptClaimContainer extends React.Component {
  render() {
    return (<ReviewReceiptClaim {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewReceiptClaimContainer)

