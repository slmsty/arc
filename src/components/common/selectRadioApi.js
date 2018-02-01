/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import { Select,Radio } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

export default class SelectRadioApi extends React.Component {
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
        options.unshift({ paramValue: 'all', paramValueDesc: '请选择' })
      }
      this.setState({
        options,
      })
    }
  }
  handleChange = (value) => {
    if (value === 'all') {
      this.props.onChange('')
    } else {
      this.props.onChange(value)
    }
  }
  render() {
    const options = this.props.options.length>0 ? this.props.options :this.state.options
    const optionDom = options ? options.map(option => <RadioButton style={{ marginRight: '10px', borderRadius: '4px' }} key={option.paramValue ? option.paramValue : 'no_select'} value={option.paramValue}>{option.paramValueDesc}</RadioButton>) : null
    return (
      <RadioGroup
        size="large" style={{ width: this.props.options.length ? '1000px' :'330px' }}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        value={this.props.value ? this.props.value : (this.props.initialValue ? this.props.initialValue : 'all')}
        disabled={this.props.disabled}
      >
        {optionDom}
      </RadioGroup>
    )
  }
}

SelectRadioApi.propTypes = {
  placeholder: PropTypes.string,
  typeCode: PropTypes.string,
  paramCode: PropTypes.string,
  value: PropTypes.string,
  initialValue: PropTypes.string,
  hasEmpty: PropTypes.bool,
}
