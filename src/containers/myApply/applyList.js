import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ApplaySearchCon from '../../components/myApply/applySearch'
import { getMyApplyList, approveSubmit, approveReject, myApplyInfo, billApproveSave } from '../../actions/myApply'
import { fileDown } from '../../actions/billStatusManage/billStatusManage'
import { getContractUrl } from '../../actions/billApplication'
import { billStartWorkFlow, searchContractBilling, getApplicationDetail } from '../../actions/billApplication'

const mapStateToProps = state => ({
  myApply: state.myApply,
  contractUrl: state.billApplication.contractUrl,
  applicationInfo: state.billApplication.applicationInfo,
  billStartSuccess: state.billApplication.billStartSuccess,
  role: state.common.permission.role,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getMyApplyList,
    approveSubmit,
    approveReject,
    myApplyInfo,
    billApproveSave,
    fileDown,
    getContractUrl,
    billStartWorkFlow,
    searchContractBilling,
    getApplicationDetail,
  }, dispatch)
)
// eslint-disable-next-line react/prefer-stateless-function
class ApplyListContainer extends React.Component {
  render() {
    return (
      <ApplaySearchCon {...this.props} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyListContainer)

