/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'

const { MonthPicker, RangePicker } = DatePicker
const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class CBSTurnoverWholenessConfirmSearch extends React.Component {
  componentDidMount() {
  }
  onSelectCustomer = (customer) => {
    console.log(customer)
  }
  handleQuery = () => {
    const customer = this.props.form.getFieldValue('customer')
    console.log(customer)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="收款日期">
                {getFieldDecorator('receive', {
                  initialValue: [moment(), moment()],
                })(
                  <RangePicker
                    format={dateFormat}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('customer')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status')(
                  <Select
                    placeholder="请选择数据状态"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    <Option key="111">1111</Option>
                    <Option key="222">222</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('method')(
                  <Select
                    mode="combobox"
                    placeholder="请选择收款方法"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    <Option key="c1">1111</Option>
                    <Option key="c2">222</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" onClick={this.handleQuery}>查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

CBSTurnoverWholenessConfirmSearch.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
}

const CBSTurnoverWholenessConfirmSearchWithForm = Form.create()(CBSTurnoverWholenessConfirmSearch)

export default CBSTurnoverWholenessConfirmSearchWithForm
