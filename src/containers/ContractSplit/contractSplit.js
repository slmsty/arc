/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ContractSplit from '../../components/contractSplit/contractSplit'
import { getContractList, saveContractSplitInfo, getUrl,sendERP,sendERPQuery,getProductNo } from '../../actions/contractSplit'
import { getContractStatementList } from '../../actions/statement'

const mapStateToProps = state => ({
  contractSplitDara: state.contractSplitData,
  user: state.common.user,
  statement: state.statement,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getContractList,
    saveContractSplitInfo,
    getUrl,
    sendERP,
    sendERPQuery,
    getContractStatementList,
    getProductNo
  }, dispatch)
)
// eslint-disable-next-line react/prefer-stateless-function
class ContractSplitContainer extends React.Component {
  render() {
    return (
      <ContractSplit {...this.props} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractSplitContainer)

