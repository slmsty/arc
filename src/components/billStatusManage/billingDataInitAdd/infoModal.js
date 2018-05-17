/**
 * Created by liangshuang on 18/5/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import SelectInvokeApi from '../../common/selectInvokeApi'
import currency from '../../../util/currency'
import { Modal, Form, Table, Row, Col, Button, Input, Checkbox, DatePicker, Select, message, InputNumber } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class InfoModal extends React.Component {
  save =() => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = this.props.form.getFieldsValue()
        const param = {}
        param.invoiceNumber = params.invoiceNumber
        param.invoiceCode = params.invoiceCode
        param.billingDate = params.billingDate.format(dateFormat)
        param.taxIncludeAmount = params.taxIncludeAmount.replace(/,/g,'')
        param.taxRate = params.taxRate
        param.taxExcludeAmount = params.taxExcludeAmount.replace(/,/g,'')
        this.props.saveData(param)
      }
    })

}
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    let dataSource = this.props.data
    console.log('dataSource.taxRate',dataSource.taxRate)
    return (
      <div>
        <Modal
          width={600}
          title="详情"
          visible={true}
          onOk={this.props.colseModal}
          onCancel={this.props.colseModal}
          footer={null}
        >
          <div style={{textAlign: 'center',marginBottom:'20px'}}>
            <Form>
              <Row gutter={40}>
                <Col span={12} key={1}>
                  <FormItem {...formItemLayout} label="项目编码">
                    {getFieldDecorator('projectNo', {
                      initialValue: dataSource.projectNo,
                    })(<Input disabled={true}/>)}
                  </FormItem>
                </Col>
                <Col span={12} key={2}>
                  <FormItem {...formItemLayout} label="款项名称">
                    {getFieldDecorator('paymentName', {
                      initialValue: dataSource.paymentName,
                    })(<Input disabled={true} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12} key={3}>
                  <FormItem {...formItemLayout} label="发票号">
                    {getFieldDecorator('invoiceNumber', {
                      initialValue: dataSource.invoiceNumber,
                      rules: [
                        { required: true, message: '请输入发票号', },
                      ]
                    })(<Input/>)}
                  </FormItem>
                </Col>
                <Col span={12} key={4}>
                  <FormItem {...formItemLayout} label="发票代码">
                    {getFieldDecorator('invoiceCode', {
                      initialValue: dataSource.invoiceCode,
                      rules: [
                        { required: true, message: '请输入发票代码', },
                      ]
                    })(<Input/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12} key={5}>
                  <FormItem {...formItemLayout} label="签约公司">
                    {getFieldDecorator('companyName', {
                      initialValue: dataSource.companyName,
                    })(<Input disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={12} key={6}>
                  <FormItem {...formItemLayout} label="客户名称">
                    {getFieldDecorator('custName', {
                      initialValue: dataSource.custName,
                    })(<Input disabled={true} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12} key={7}>
                  <FormItem {...formItemLayout} label="发票类型">
                    {getFieldDecorator('invoiceTypeName', {
                      initialValue: dataSource.invoiceTypeName,
                    })(<Select disabled={true}>
                      <Option value="普票">普票</Option>
                      <Option value="专票">专票</Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={12} key={8}>
                  <FormItem {...formItemLayout} label="开票日期">
                    {getFieldDecorator('billingDate', {
                      initialValue: moment(dataSource.billingDate),
                      rules: [
                        { required: true, message: '请选择开票日期', },
                      ]
                    })(
                      <DatePicker
                        format={dateFormat}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12} key={9}>
                  <FormItem {...formItemLayout} label="含税金额">
                    {getFieldDecorator('taxIncludeAmount', {
                      initialValue: currency(dataSource.taxIncludeAmount),
                      rules: [
                        { required: true, message: '请选择含税金额', },
                      ]
                    })(<Input/>)}
                  </FormItem>
                </Col>
                <Col span={12} key={10}>
                  <FormItem {...formItemLayout} label="不含税金额">
                    {getFieldDecorator('taxExcludeAmount', {
                      initialValue: currency(dataSource.taxExcludeAmount),
                      rules: [
                        { required: true, message: '请选择不含税金额', },
                      ]
                    })(<Input/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12} key={11}>
                  <FormItem {...formItemLayout} label="税率">
                    {getFieldDecorator('taxRate', {
                      initialValue: dataSource.taxRate+'',
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="TAX_RATE"
                        placeholder="税率"
                        hasAll
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col style={{textAlign: 'center',marginTop:'20px'}}>
                  <Button type="primary" onClick={()=>this.save()}>保存</Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}
const InfoModalFrom = Form.create()(InfoModal)
export default InfoModalFrom
