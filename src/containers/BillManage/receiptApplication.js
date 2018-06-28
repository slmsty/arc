import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReceiptAppply from '../../components/billStatusManage/receiptApplication/receiptApply'
import * as actions from '../../actions/billStatusManage/receiptApplication'

const mapStateToProps = state => ({
  ...state.receiptApply,
  role: state.common.permission.role,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    ...actions,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptAppply)

