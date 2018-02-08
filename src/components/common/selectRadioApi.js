/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import { Select,Radio } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
//报表测试
const testoptions = [
  {
    paramCode: "APPLY_TYPE",
    paramValue: "100",
    paramValueDesc: "收款信息查询表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1001",
    paramValueDesc: "发票信息查询表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1002",
    paramValueDesc: "发票及收款信息查询表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1003",
    paramValueDesc: "应收账款询证函报表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1004",
    paramValueDesc: "项目综合信息查询报表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1005",
    paramValueDesc: "整体合同内容查询",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1006",
    paramValueDesc: "转包项目表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
]
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
      //const options = testoptions
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
        size="large" style={{ width: this.props.options.length ? '1000px' :'1000px' }}
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
