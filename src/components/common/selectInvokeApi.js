/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len */
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
    if (this.props.typeCode && this.props.paramCode) {
      requestJsonFetch(`/arc/sysparam/get/${this.props.typeCode}/${this.props.paramCode}`, { method: 'get' }, this.handleCallback)
    }
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        options: response.data,
      })
    }
  }
  render() {
    const optionDom = this.state.options ? this.state.options.map(option => <Option key={option.paramValue}>{option.paramValueDesc}</Option>) : null
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
  typeCode: PropTypes.string.isRequired,
  paramCode: PropTypes.string.isRequired,
}
