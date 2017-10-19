import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NoProjectReceiptClaim from '../../components/noProjectReceiptClaim/noProjectReceiptClaim'

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class NoProjectReceiptClaimContainer extends React.Component {
  render() {
    return (<NoProjectReceiptClaim {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoProjectReceiptClaimContainer)

