/* eslint-disable max-len */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import ProjectReceiptClaim from '../../components/projectReceiptClaim/projectReceiptClaim'

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ProjectReceiptClaimContainer extends React.Component {
  render() {
    return (<ProjectReceiptClaim {...this.props} />)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectReceiptClaimContainer))

