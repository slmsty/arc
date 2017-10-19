import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber } from 'antd'

export default class EditableNumberCell extends React.Component {
  handleChange(e) {
    const value = e.target.value
    this.props.onChange(value)
  }
  render() {
    const { value, editable } = this.props
    return (
      <div>
        {
          editable ?
            <div>
              <InputNumber
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ''}
            </div>
        }
      </div>
    )
  }
}

EditableNumberCell.defaultProps = {
  value: '',
}

EditableNumberCell.propTypes = {
  value: PropTypes.number,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}
