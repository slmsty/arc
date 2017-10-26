/* eslint-disable max-len */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { getReceiptList, reject } from '../../actions/projectReceiptClaim'
import ProjectReceiptClaim from '../../components/projectReceiptClaim/projectReceiptClaim'

const mapStateToProps = state => ({
  projectReceiptClaim: state.projectReceiptClaim,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getReceiptList,
    reject,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ProjectReceiptClaimContainer extends React.Component {
  render() {
    return (<ProjectReceiptClaim {...this.props} />)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectReceiptClaimContainer))

