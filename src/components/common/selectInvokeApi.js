/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props */
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
      const options = response.data
      if (this.props.hasEmpty) {
        options.unshift({ paramValue: '', paramValueDesc: '请选择' })
      }
      this.setState({
        options,
      })
    }
  }
  render() {
    const optionDom = this.state.options ? this.state.options.map(option => <Option key={option.paramValue ? option.paramValue : 'no_select'} value={option.paramValue}>{option.paramValueDesc}</Option>) : null
    return (
      <Select
        id={this.props.id}
        placeholder={this.props.placeholder}
        onChange={value => this.props.onChange(value)}
        value={this.props.value !== undefined ? this.props.value : this.props.initialValue}
      >
        {optionDom}
      </Select>
    )
  }
}

SelectInvokeApi.propTypes = {
  placeholder: PropTypes.string.isRequired,
  typeCode: PropTypes.string.isRequired,
  paramCode: PropTypes.string.isRequired,
  value: PropTypes.string,
  initialValue: PropTypes.string,
  hasEmpty: PropTypes.bool,
}
