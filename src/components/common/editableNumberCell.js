import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber } from 'antd'

export default class EditableNumberCell extends React.Component {
  state = {
  }
  render() {
    const { value, editable } = this.props
    if (editable) {
      return (
        <InputNumber
          value={value}
          min={this.props.min}
          max={this.props.max}
          precision={2}
          onChange={v => this.props.onChange(v)}
        />
      )
    }
    return (
      <div className="editable-row-text">
        {value.toString() || 0}
      </div>
    )
  }
}

EditableNumberCell.defaultProps = {
  value: 0,
  min: -Infinity,
  max: Infinity,
}

EditableNumberCell.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}
