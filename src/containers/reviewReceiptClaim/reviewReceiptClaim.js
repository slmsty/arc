import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReviewReceiptClaim from '../../components/reviewReceiptClaim/reviewReceiptClaim'

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ReviewReceiptClaimContainer extends React.Component {
  render() {
    return (<ReviewReceiptClaim {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewReceiptClaimContainer)

