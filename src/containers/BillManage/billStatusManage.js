/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BillStatusManage from '../../components/billStatusManage/billStatusManage'
import { getBillStatusList, getBillStatusDetail, getBillStatusContractDetail, getBillStatusBillResult, cancelApprove, disableApprove, sendAP, fileDown, invoiceSendTax } from '../../actions/billStatusManage/billStatusManage'
import { myApplyInfo } from '../../actions/myApply'

const mapStateToProps = state => ({
  billStatusManage: state.billStatusManage,
  myApply: state.myApply,
  currentUser: state.common.user,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getBillStatusList,
    getBillStatusDetail,
    getBillStatusContractDetail,
    getBillStatusBillResult,
    cancelApprove,
    disableApprove,
    sendAP,
    myApplyInfo,
    fileDown,
    invoiceSendTax,
  }, dispatch)
)
// eslint-disable-next-line react/prefer-stateless-function
class BillStatusManageContainer extends React.Component {
  render() {
    return (
      <BillStatusManage {...this.props} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillStatusManageContainer)

