/**
 * Created by liangshuang on 17/12/13.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import moment from 'moment'

export default class MyDatePicker extends React.Component{
  handleChange = (date, dateString) => {
    const {indexs, columns} = this.props
    this.props.onChange({
      date: date,
      dateString: dateString,
      indexs: indexs,
      columns: columns,
    })
  }
  render() {
    const value = this.props.value
    return (
      <DatePicker onChange={this.handleChange} defaultValue={value ? moment(value) : ''} disabled={this.props.disabled} />
    )
  }
}
