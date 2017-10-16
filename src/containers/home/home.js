import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Home from '../../components/home/home'

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class HomeContainer extends React.Component {
  render() {
    return (<Home {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)

