import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'

export default class EditableTextCell extends React.Component {
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
              <Input
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

EditableTextCell.defaultProps = {
  value: '',
}

EditableTextCell.propTypes = {
  value: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}
