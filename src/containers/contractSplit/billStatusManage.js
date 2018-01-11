/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BillStatusManage from '../../components/billStatusManage/billStatusManage'
import { getBillStatusList, getBillStatusDetail, getBillStatusContractDetail, getBillStatusBillResult } from '../../actions/billStatusManage/billStatusManage'

const mapStateToProps = state => ({
  billStatusManage: state.billStatusManage,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getBillStatusList,
    getBillStatusDetail,
    getBillStatusContractDetail,
    getBillStatusBillResult,
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

