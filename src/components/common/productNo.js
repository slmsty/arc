/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const Option = Select.Option

export default class SelectInvokeApi extends React.Component {
  state = {
    options: [''],
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
      if (options[i].productNo == value ) {
        name = options[i].productNo
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
  render() {
    // 去重
    const optionData = this.state.options;
    const productNoData = [];
    optionData.map(item=>{
      productNoData.push(item.productNo ? item.productNo : '')
    })
    const productNo = [... new Set(productNoData)];
    const optionsDom = productNo ? productNo.map(option => <Option key={!option && option != 0 ? 'no_select' : option } value={option}>{option}</Option>) : null
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
