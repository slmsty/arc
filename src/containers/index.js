import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Index from '../components/index'
import NoMatch from '../components/noMatch/noMatch'
import { getUserInfo } from '../actions/user'

import HomeContainer from '../containers/home/home'
import ProjectReceiptClaimContainer from '../containers/projectReceiptClaim/projectReceiptClaim'

const mapStateToProps = state => ({
  user: state.user,
  title: state.common.title,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUserInfo,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class IndexContainer extends React.Component {
  componentWillMount() {
    // this.props.getUserInfo()
  }

  render() {
    //  eslint-disable-next-line
    const { accountId, accountName, ntAccount } = this.props.user
    if (!accountId || !accountName || !ntAccount) {
      return null
    }
    return (
      <Router basename="/">
        <div style={{ height: '100%' }}>
          <Index {...this.props}>
            <Switch>
              <Route exact path="/" component={HomeContainer} />
              <Route exact path="/home" component={HomeContainer} />
              <Route exact path="/projectReceiptClaim" component={ProjectReceiptClaimContainer} />
              <Route component={NoMatch} />
            </Switch>
          </Index>
        </div>
      </Router>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexContainer)
