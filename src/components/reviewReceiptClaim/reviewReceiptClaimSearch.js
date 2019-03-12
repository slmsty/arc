/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import MultipleInput from '../common/multipleInput'
import SelectInvokeApi from '../common/selectInvokeApi'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class ReviewReceiptClaimSearch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  onSelectCustomer = (customer) => {
   
  }
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    param.custId = param.custId && param.custId.length ? param.custId[0] : null
    param.receiptDateStart = param.receiptDate && param.receiptDate.length ? param.receiptDate[0].format(dateFormat) : ''
    param.receiptDateEnd = param.receiptDate && param.receiptDate.length ? param.receiptDate[1].format(dateFormat) : ''

    param.statusDateStart = param.statusDate && param.statusDate.length ? param.statusDate[0].format(dateFormat) : ''
    param.statusDateEnd = param.statusDate && param.statusDate.length ? param.statusDate[1].format(dateFormat) : ''
    delete param.receiptDate
    delete param.statusDate
    // console.log(param)
    this.props.onQuery(param)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please enter custOrderIds!' }],
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
                  // initialValue: [moment().subtract(1, 'month'), moment()],
                  initialValue: [moment().startOf('month'), moment().endOf('month')],
                })(<RangePicker
                  allowClear
                  format={dateFormat}
                  ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('custId')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={9}>
              <FormItem {...formItemLayout} label="数据状态">
                {
                  getFieldDecorator('status', {
                    initialValue: '31',
                  })(
                    <SelectInvokeApi
                      typeCode="ARC_CLAIM_REVIEW_FUNC"
                      paramCode="STATUS"
                    />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('receiptMethodId')(
                  <SelectReceiptMethodWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="订单号(多)">
                {getFieldDecorator('custOrderIds')(
                  <MultipleInput
                    placeholder="多订单号使用英文逗号间隔"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="项目编码(多)">
                {
                  getFieldDecorator('projectIds')(
                    <MultipleInput
                      placeholder="多项目编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="公司">
                {getFieldDecorator('companyName')(<Input onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
            <Col span={8} key={9}>
              <FormItem {...formItemLayout} label="收款分类">
                {getFieldDecorator('claimType', {
                  initialValue: 'project',
                })(
                  <SelectInvokeApi
                    id="claimType"
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CLAIM_TYPE"
                    placeholder="请选择收款分类" // <Select><Option value="project">项目</Option><Option value="">百一测评</Option</Select>
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('contractIds')(
                    <MultipleInput
                      placeholder="多合同编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="操作日期">
                {getFieldDecorator('statusDate', {
                  // initialValue: [moment().subtract(1, 'month'), moment()],
                  initialValue: [moment().startOf('month'), moment().endOf('month')],
                })(<RangePicker
                  allowClear
                  format={dateFormat}
                  ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                />)}
              </FormItem>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

ReviewReceiptClaimSearch.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}

const ReviewReceiptClaimSearchWithForm = Form.create()(ReviewReceiptClaimSearch)

export default ReviewReceiptClaimSearchWithForm
