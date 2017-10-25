import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomerBankLink from '../../components/customerBankLink/customerBankLink'

const mapStateToProps = state => ({
  user: state.user,
  reviewReceiptClaim: state.reviewReceiptClaim,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class CustomerBankLinkContainer extends React.Component {
  render() {
    return (<CustomerBankLink {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBankLinkContainer)

