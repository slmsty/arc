/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

export default class EditableSelectCell extends React.Component {
  getOptionValue = () => {
    let value = ''
    this.props.options.forEach((option) => {
      if (option.id === this.props.value) {
        value = option.name
      }
    })
    return value
  }
  renderOptions = () => {
    const optionDoms = this.props.options.map((option) => {
      const optionDom = (<Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>)
      return optionDom
    })
    return optionDoms
  }
  render() {
    const { value, editable } = this.props
    return (
      <div>
        {
          editable ?
            <div>
              <Select
                style={{ width: 100 }}
                value={value}
                onChange={v => this.props.onChange(v)}
              >
                {this.renderOptions()}
              </Select>
            </div>
            :
            <div className="editable-row-text">
              {this.getOptionValue()}
            </div>
        }
      </div>
    )
  }
}

EditableSelectCell.defaultProps = {
  value: '',
}

EditableSelectCell.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}
