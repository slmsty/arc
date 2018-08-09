/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Icon, DatePicker, Select } from 'antd'
import moment from 'moment'
import SelectInvokeApi from '../common/selectInvokeApi'
import MultipleInput from '../common/multipleInput'
import SelectSearch from '../billApplication/selectSearch'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'
const applyColumns = [{
    title: '申请人',
    dataIndex: 'accountName',
    width: 100,
  },
  {
    title: '申请人编码',
    dataIndex: 'staffCode',
    width: 100,
}]
class BillStatusManageWithFormCon extends React.Component {

  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    param.beginDate = param.signDate && param.signDate.length ? param.signDate[0].format(dateFormat) : ''
    param.endDate = param.signDate && param.signDate.length ? param.signDate[1].format(dateFormat) : ''
    param.invoiceCode = param.invoiceCode && param.invoiceCode.length ? param.invoiceCode.join(',') : ''

    param.accountId = param.accountId[0]
    delete param.signDate
    this.props.onQuery({
      ...param,
      beginDate: param.signDate && param.signDate.length ? param.signDate[0].format(dateFormat) : '',
      endDate: param.signDate && param.signDate.length ? param.signDate[1].format(dateFormat) : '',
      invoiceCode: param.invoiceCode && param.invoiceCode.length ? param.invoiceCode.join(',') : '',
      cutomer: param.cutomer ? param.cutomer.trim() : '',
      projectCode: param.projectCode ? param.projectCode.trim() : '',
      contractCode: param.contractCode ? param.contractCode.trim() : '',
      applicationId: param.applicationId ? param.applicationId.trim() : '',
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="开票申请日期">
                {getFieldDecorator('signDate', {
                  initialValue: '',
                })(<RangePicker
                  allowClear
                  format={dateFormat}
                  ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="合同客户名称">
                {
                  getFieldDecorator('cutomer')(<Input />)
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="项目编码">
                {
                  getFieldDecorator('projectCode')(
                    <Input
                      placeholder="项目编码"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <SelectInvokeApi
                    typeCode="BILLING_APPLICATION_STATUS"
                    paramCode="STATUS"
                    placeholder="数据状态"
                    hasAll
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="合同编码">
                {
                  getFieldDecorator('contractCode')(
                    <Input
                      placeholder="合同编码"
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="发票号(多)">
                {
                  getFieldDecorator('invoiceCode')(
                    <MultipleInput
                      placeholder="多发票号使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="申请人">
                {getFieldDecorator('accountId', {
                  initialValue: '',
                })(
                  <SelectSearch
                    url="/arc/application/invoice/operator"
                    columns={applyColumns}
                    label="申请人"
                    idKey="accountId"
                    valueKey="accountName"
                    showSearch={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="开票申请分类">
                {getFieldDecorator('applicationType', {
                  initialValue: '',
                })(
                  <SelectInvokeApi
                    typeCode="BILLING_APPLICATION_STATUS"
                    paramCode="BILLING_APPLICATION_TYPE"
                    placeholder="开票申请分类"
                    hasEmpty={false}
                    hasAll
                  />
                )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="申请单编号">
                {getFieldDecorator('applicationId', {
                  initialValue: '',
                })(
                  <Input placeholder="申请单编号"/>
                )
                }
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
BillStatusManageWithFormCon.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}
const BillStatusManageWithForm = Form.create()(BillStatusManageWithFormCon)

export default BillStatusManageWithForm
