/**
 * Created by liangshuang on 18/5/14.
 */
import React from 'react'
import { Form, Row, Col, Button, Input, Icon, DatePicker } from 'antd'
import SelectInvokeApi from '../../common/selectInvokeApi'
import moment from 'moment'
const FormItem = Form.Item

class BillingDataInitAddWithFromCom extends React.Component {
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    this.props.getBillDataInitList({
      ...param,
      approveCPDate: param.approveCPDate? param.approveCPDate.format('YYYY-MM-DD') : ''
    })
  }
  /*exportExcel = () => {
    const values = this.props.form.getFieldsValue()
    this.props.exportExcel({
      ...values,
      approveCPDate: values.approveCPDate? values.approveCPDate.format('YYYY-MM-DD') : ''
    })
  }
  clearFormValues = () => {
    this.props.form.resetFields()
  }*/
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    }
    return (
      <div>
        <Form className="ant-search-form">
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="项目编码">
                {getFieldDecorator('projectNo', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('custName', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="发票号">
                {getFieldDecorator('invoiceNumbers', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="合同编码">
                {getFieldDecorator('contractNo', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="签约公司">
                {getFieldDecorator('companyName', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="数据来源">
                {getFieldDecorator('createType', {
                  initialValue: '',
                })(
                  <SelectInvokeApi
                    typeCode="CREATE_TYPE"
                    paramCode="CREATE_TYPE"
                    placeholder="数据状态"
                    hasAll
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="申请单号">
                {getFieldDecorator('applicationId', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="开票状态">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <SelectInvokeApi
                  typeCode="BILLING_STATUS"
                  paramCode="STATUS"
                  placeholder="数据状态"
                  hasAll
                />
                )}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="审批完成日期">
                {getFieldDecorator('approveCPDate', {
                  initialValue: "",
                })(
                  <DatePicker />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24} key={7} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.handleQuery}><Icon type="search" />查询</Button>
              <Button type="primary" style={{marginLeft: '15px'}} onClick={this.exportExcel}><Icon type="export" />导出</Button>
              <Button type="primary" ghost style={{marginLeft: '15px'}} onClick={this.clearFormValues}>清空</Button>
            </Col>
          </Row>
        </Form>
      </div>
      )

  }
}
const BillingDataInitAddWithFrom = Form.create()(BillingDataInitAddWithFromCom)

export default BillingDataInitAddWithFrom
