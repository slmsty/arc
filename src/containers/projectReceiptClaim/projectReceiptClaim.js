/* eslint-disable max-len */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { getReceiptList, reject, getReceiptInfo, changeClaimType } from '../../actions/projectReceiptClaim'
import ProjectReceiptClaim from '../../components/projectReceiptClaim/projectReceiptClaim'

const mapStateToProps = state => ({
  receiptClaimList: state.projectReceiptClaim.receiptClaimList,
  receiptClaimListRefresh: state.projectReceiptClaim.receiptClaimListRefresh,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getReceiptList,
    reject,
    getReceiptInfo,
    changeClaimType,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ProjectReceiptClaimContainer extends React.Component {
  render() {
    return (
      <div>
        <ProjectReceiptClaim {...this.props} />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectReceiptClaimContainer))

