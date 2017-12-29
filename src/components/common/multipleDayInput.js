/* eslint-disable react/prefer-stateless-function,react/prop-types */
import React from 'react'
import { Select } from 'antd'
import moment from 'moment'

moment.locale('zh-cn')
const dateFormat = 'YYYY-MM-DD'
export default class MultipleDayInput extends React.Component {
  state = {
    day: [],
  }
  textTemp = ''
  handleChange = (values) => {
    this.textTemp = ''
    const day = []
    values.forEach((value) => {
      const checkDay = moment(value)
      if (checkDay.isValid()) {
        day.push(checkDay.format(dateFormat))
      }
    })
    this.setState({ day })
    this.props.onChange(day)
  }
  handleSearch = (value) => {
    this.textTemp = value
  }
  handleBlur= () => {
    if (this.textTemp) {
      const checkDay = moment(this.textTemp)
      if (checkDay.isValid()) {
        const day = this.state.day
        day.push(checkDay.format(dateFormat))
        this.setState({ day })
        this.props.onChange(day)
      }
    }
    this.textTemp = ''
  }
  render() {
    return (
      <Select
        mode="tags"
        value={this.state.day}
        tokenSeparators={[',', '，']}
        placeholder="多日期使用英文逗号间隔"
        dropdownStyle={{ display: 'none' }}
        onChange={value => this.handleChange(value)}
        onSearch={value => this.handleSearch(value)}
        onBlur={() => this.handleBlur()}
      />
    )
  }
}
