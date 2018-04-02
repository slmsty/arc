import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MyApplyCon from '../../components/myApply/myApply'
import { myApplyList, approveSubmit, approveReject, myApplyInfo, billApproveSave, cancelApply } from '../../actions/myApply'
import { fileDown } from '../../actions/billStatusManage/billStatusManage'
import { billApplySave, billApplyCheck, getContractUrl, billApplicationRedApply } from '../../actions/billApplication'

const mapStateToProps = state => ({
  myApplyPage: state.myApply.myApplyPage,
  myApplyDetail: state.myApply.getMyApplyInfo,
  billSaveSuccess: state.myApply.billSaveSuccess,
  contractUrl: state.billApplication.contractUrl,
  currentUser: state.common.user,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    myApplyList,
    approveSubmit,
    approveReject,
    myApplyInfo,
    billApproveSave,
    fileDown,
    getContractUrl,
    cancelApply,
    billApplySave,
    billApplyCheck,
    billApplicationRedApply,
  }, dispatch)
)
// eslint-disable-next-line react/prefer-stateless-function
class MyApplyContainer extends React.Component {
  render() {
    return (
      <MyApplyCon {...this.props} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyApplyContainer)

