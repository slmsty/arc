/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class CBSTurnoverWholenessConfirmSearch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = (e) => {
    e ? e.preventDefault() : null
    const param = this.props.form.getFieldsValue()
    param.receiptDateStart = param.receiptDate[0].format(dateFormat)
    param.receiptDateEnd = param.receiptDate[1].format(dateFormat)
    delete param.receiptDate
    this.props.query(param)
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
          onSubmit={this.handleQuery}
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="收款日期">
                {getFieldDecorator('receiptDate', {
                  initialValue: [moment().subtract(1, 'month'), moment()],
                })(
                  <RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('custId')(<SelectCustomerWithForm />)}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '10',
                })(
                  <Select>
                    <Option value="10">新建</Option>
                    <Option value="20">出纳待确认</Option>
                    <Option value="11">无需认款</Option>
                    <Option value="30">会计退回</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('receiptMethodId')(<SelectReceiptMethodWithForm />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
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
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  query: PropTypes.func.isRequired,
}

const CBSTurnoverWholenessConfirmSearchWithForm = Form.create()(CBSTurnoverWholenessConfirmSearch)

export default CBSTurnoverWholenessConfirmSearchWithForm
