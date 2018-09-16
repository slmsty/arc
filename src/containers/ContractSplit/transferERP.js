import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TransferERP from '../../components/contractSplit/TransferERP'
import { sendERP,sendERPQuery,getProductNo } from '../../actions/contractSplit'
import { getContractStatementList } from '../../actions/statement'

const mapStateToProps = state => ({
  user: state.common.user,
  erpList: state.contractSplitData.erpList,
  sendResult: state.contractSplitData.sendResult,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    sendERP,
    sendERPQuery,
    getContractStatementList,
    getProductNo
  }, dispatch)
)

class TransferERPContainer extends React.Component{
  render(){
    return (
      <TransferERP
        {...this.props}
      />
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TransferERPContainer)

