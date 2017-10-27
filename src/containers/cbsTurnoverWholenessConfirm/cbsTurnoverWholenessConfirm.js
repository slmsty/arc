import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { getCBSTurnoverWholenessData } from '../../actions/cbsTurnoverWholenessConfirm'
import CBSTurnoverWholenessConfirm from '../../components/cbsTurnoverWholenessConfirm/cbsTurnoverWholenessConfirm'

const mapStateToProps = state => ({
  cbsTurnoverWholenessConfirm: state.cbsTurnoverWholenessConfirm,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getCBSTurnoverWholenessData,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class CBSTurnoverWholenessConfirmContainer extends React.Component {
  render() {
    return (<CBSTurnoverWholenessConfirm {...this.props} />)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CBSTurnoverWholenessConfirmContainer))

