import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Login from '../../components/login/login'
import { getUserInfo, getPermission } from '../../actions/common'

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUserInfo,
    getPermission,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Login)

