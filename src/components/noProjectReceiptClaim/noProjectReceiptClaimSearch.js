/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import SelectReceiptCompanyWithForm from '../common/selectReceiptCompany'
import MultipleDayInput from '../common/multipleDayInput'
import MultipleInput from '../common/multipleInput'
import SelectInvokeApi from '../common/selectInvokeApi'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class NoProjectReceiptClaimSearch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = () => {
    const param = this.props.form.getFieldsValue()
    param.receiptDateStart = param.receiptDate[0].format(dateFormat)
    param.receiptDateEnd = param.receiptDate[1].format(dateFormat)
    delete param.receiptDate
    this.props.onQuery(param)
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
                {getFieldDecorator('receiptDate', {
                  initialValue: [moment('2017-08-01'), moment()],
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
                {getFieldDecorator('custId')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="收款来源">
                {getFieldDecorator('sourceType', {
                  initialValue: 'cbs',
                })(
                  <SelectInvokeApi
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="SOURCE_TYPE"
                    placeholder="请选择收款来源"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="项目编码">
                {getFieldDecorator('projectIds')(
                  <MultipleInput
                    placeholder="多项目编码使用英文逗号间隔"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('receiptMethodId')(
                  <SelectReceiptMethodWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={10}>
              <FormItem {...formItemLayout} label="收款编号">
                {getFieldDecorator('code')(
                  <Input placeholder="请输入收款编号" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="收款日期">
                {getFieldDecorator('receiptDates')(
                  <MultipleDayInput />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={9}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '21',
                })(
                  <Select>
                    <Option value="21">出纳已确认</Option>
                    <Option value="40">复核退回</Option>
                    <Option value="51">已传送AR</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="认款公司">
                {getFieldDecorator('receiptCompanyId')(
                  <SelectReceiptCompanyWithForm />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

NoProjectReceiptClaimSearch.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}

const NoProjectReceiptClaimSearchWithForm = Form.create()(NoProjectReceiptClaimSearch)

export default NoProjectReceiptClaimSearchWithForm
