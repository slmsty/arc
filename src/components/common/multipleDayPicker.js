/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Input, DatePicker } from 'antd'
import moment from 'moment'

const InputGroup = Input.Group
moment.locale('zh-cn')
export default class MultipleDayPicker extends React.Component {
  state = {
    day: '',
  }
  handleOk = () => {
    this.setState({
      day: 'abcdefg',
    })
    this.props.onChange('abcdefg')
    this.handleCancel()
  }
  dayPicker = () => {

  }
  render() {
    return (
      <InputGroup compact>
        <Input
          style={{ height: 32, width: '80%' }}
          placeholder="多收款日期使用英文逗号间隔"
          value={this.state.day}
          onChange={value => this.props.onChange(value)}
        />
        <DatePicker
          placeholder=""
          style={{ height: 32, width: 32 }}
        />
      </InputGroup>
    )
  }
}

MultipleDayPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
}

