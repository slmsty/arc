import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomerBankLink from '../../components/customerBankLink/customerBankLink'
import { getArcCustBankList, addArcCustBankData, deleteArcCustBankDatas, deleteArcCustBankData } from '../../actions/arcCustBank'

const mapStateToProps = state => ({
  arcCustBankLink: state.arcCustBankLink,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getArcCustBankList,
    addArcCustBankData,
    deleteArcCustBankDatas,
    deleteArcCustBankData,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class CustomerBankLinkContainer extends React.Component {
  render() {
    return (<CustomerBankLink {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBankLinkContainer)

