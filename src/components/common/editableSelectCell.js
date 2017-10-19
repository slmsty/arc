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
  handleChange(e) {
    const value = e.target.value
    this.props.onChange(value)
  }
  renderOptions = () => {
    const optionDoms = this.props.options.map((option) => {
      const optionDom = (<Select.Option value={option.id}>{option.name}</Select.Option>)
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
                value={value}
                onChange={e => this.handleChange(e)}
              >
                {this.renderOptions}
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
