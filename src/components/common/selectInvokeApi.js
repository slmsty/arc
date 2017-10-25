/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const Option = Select.Option

export default class SelectInvokeApi extends React.Component {
  state = {
    options: [],
  }
  componentDidMount() {
    if (this.props.api) {
      requestJsonFetch(this.props.api, {}, this.handleCallback)
    }
  }
  handleCallback = (response) => {
    console.log(response)
  }
  render() {
    const optionDom = this.state.options ? this.state.options.map((option) => {
      return <Option key={option.id}>{option.name}</Option>
    }) : null
    return (
      <Select
        id={this.props.id}
        placeholder={this.props.placeholder}
        onChange={value => this.props.onChange(value)}
      >
        {optionDom}
      </Select>
    )
  }
}

SelectInvokeApi.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  api: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
