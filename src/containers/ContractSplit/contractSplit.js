/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ContractSplit from '../../components/contractSplit/contractSplit'
import { getContractList, saveContractSplitInfo, getUrl,sendERP,sendERPQuery } from '../../actions/contractSplit'
import { getContractStatementList } from '../../actions/statement'

const mapStateToProps = state => ({
  contractSplitDara: state.contractSplitDara,
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
    getContractStatementList
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

