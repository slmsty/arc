/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const Option = Select.Option

export default class SelectInvokeApi extends React.Component {
  state = {
    options: [],
    selectValue: '',
    flag: true,
  }
  componentDidMount() {
    const options = this.props.options
    this.setState({
      options
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.options != nextProps.options) {
      const options = this.state.options;
      options.push(...nextProps.options)
      this.setState({
        options
      })
    }
  }
  handleChange = (value) => {
    const options = this.state.options.slice(0)
    let name = ''
    for (let i = 0; i < options.length; i++) {
      if (options[i].optionsValue == value ) {
        name = options[i].paramValueDesc
        break;
      }
    }
    const {indexs, columns} = this.props
    if (value === 'all') {
      this.props.onChange('')
    } else {
      this.props.onChange({
        No: value,
        Name:name,
        indexs: indexs,
        columns: columns,
      })
    }
  }
  render(){
    // 去重
    const options = [... new Set(this.state.options)];
    const optionsDom = options ? options.map(option => {
      return <Option
        key={option.paramValue ? option.paramValueDesc : 'no_select'}
        value={option.paramValue}>
        {/*{option.paramValue ==='all' ? '' :option.paramValue}
        ({option.paramValueDesc})*/}
        {option.paramValueDesc}
      </Option>
    }) : null
    return (
      <Select
        style={{zIndex:'0'}}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        value={this.props.value}
        disabled={this.props.disabled}
      >
        {optionsDom}
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
