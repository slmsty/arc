import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import StatementListCom from '../../components/statementSearch/statementList'
import { getStatementList,getContractStatementList } from '../../actions/statement'

const mapStateToProps = state => ({
  statement: state.statement,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getStatementList,
    getContractStatementList,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class StatementListContainer extends React.Component {
  render() {
    return (<StatementListCom {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatementListContainer)

