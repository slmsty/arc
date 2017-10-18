import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setTitle } from '../../actions/common'
import CBSTurnoverWholenessConfirm from '../../components/cbsTurnoverWholenessConfirm/cbsTurnoverWholenessConfirm'

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setTitle,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class CBSTurnoverWholenessConfirmContainer extends React.Component {
  render() {
    return (<CBSTurnoverWholenessConfirm {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CBSTurnoverWholenessConfirmContainer)

