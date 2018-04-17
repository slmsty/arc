import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import StatementListCom from '../../components/statementSearch/statementList'
import { getStatementList,getProductOrderTotalList,getProductOrderDetailList,getContractStatementList,getExcel,getInvoiceDetailList,getOutcomeDetailReportList,getUnContractOutcomeDataAddList } from '../../actions/statement'

const mapStateToProps = state => ({
  statement: state.statement,

})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getStatementList,
    getContractStatementList,
    getExcel,
    getInvoiceDetailList,
    getOutcomeDetailReportList,
    getUnContractOutcomeDataAddList,
    getProductOrderTotalList,
    getProductOrderDetailList
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class OuntcomeReceiptReport extends React.Component {
  render() {
    return (<StatementListCom {...this.props} reportType = 'outcomeReceiptReport' />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OuntcomeReceiptReport)

