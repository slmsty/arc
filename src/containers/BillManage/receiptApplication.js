import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReceiptAppply from '../../components/billStatusManage/receiptApplication/receiptApply'
import { getContractUrl } from '../../actions/billApplication'
import * as actions from '../../actions/billStatusManage/receiptApplication'

const mapStateToProps = state => ({
  ...state.receiptApply,
  role: state.common.permission.role,
  contractUrl: state.billApplication.contractUrl,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    ...actions,
    getContractUrl
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptAppply)

