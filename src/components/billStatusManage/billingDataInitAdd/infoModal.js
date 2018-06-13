/**
 * Created by liangshuang on 18/5/17.
 */
import React from 'react'
import moment from 'moment'
import SelectInvokeApi from '../../common/selectInvokeApi'
import currency from '../../../util/currency'
import { Modal, Form, Table, Row, Col, Button, Input, Checkbox, DatePicker, Select, message, InputNumber } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'
const columns = [
  {
    title:'行ID',
    dataIndex:'billingAppLineId',
    width:80
  },
  {
    title:'项目编码',
    dataIndex:'projectNo',
    width:80
  },
  {
    title:'款项名称',
    dataIndex:'paymentName',
    width:80
  },
  {
    title:'申请金额',
    dataIndex:'billingAmount',
    width:80,
    render: (text) => (text ? currency(text) : text),
  },
  {
    title:'税率',
    dataIndex:'billingTaxRate',
    width:80,
    render: (text) => (text ? (text * 100) + '%' : text),
  },
]

class InfoModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }
  save =() => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.taxIncludeAmount <= 0 || values.taxExcludeAmount <= 0) {
          message.error('含税金额和不含税金额必须大于0')
          return
        }
        if (values.taxIncludeAmount < values.taxExcludeAmount ) {
          message.error('不含税金额不能大于含税金额')
          return
        }
        this.setState({
          loading: true,
        })
        const params = {
          ...values,
          invoiceNumber: values.invoiceNumber.trim(),
          invoiceCode: values.invoiceCode.trim(),
          billingDate: values.billingDate.format(dateFormat),
          billingOutcomeId: this.props.data.billingOutcomeId,
          billingDataInitResultList: this.props.resultList,
        }
        this.props.saveData(params).then(res => {
          if (res && res.response && res.response.resultCode === '000000') {
            message.success('保存成功')
          }
          this.setState({
            loading: false,
          })
        })
      }
    })
}
  getWidth = (billingDataInitColumns) => {
    let width = 0
    billingDataInitColumns.map((item,index) => {
      width += parseFloat(item.width)
    })
    return width

  }
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    let datas = this.props.data
    let billingDataInitResultList = datas.billingDataInitResultList
    let dataSource = datas.billingDataInitResult
    return (
      <div>
        <Modal
          maskClosable={false}
          width={700}
          title="详情"
          visible={true}
          onOk={this.props.colseModal}
          onCancel={this.props.colseModal}
          footer={null}
        >
          <div style={{textAlign: 'center',marginBottom:'20px'}}>
            {
              billingDataInitResultList ?
                <Table
                  bordered
                  columns={columns}
                  size="small"
                  pagination={false}
                  scroll={{ x:this.getWidth(columns) }}
                  dataSource={billingDataInitResultList}
                />
                : null
            }
            <div style={{marginBottom:'20px'}}></div>
            <Form>
              <Row gutter={40}>
                <Col span={12} key={3}>
                  <FormItem {...formItemLayout} label="发票号">
                    {getFieldDecorator('invoiceNumber', {
                      initialValue: dataSource.invoiceNumber,
                      rules: [
                        { required: true, message: '请输入8位发票号',len:8 },
                      ]
                    })(<Input/>)}
                  </FormItem>
                </Col>
                <Col span={12} key={4}>
                  <FormItem {...formItemLayout} label="发票代码">
                    {getFieldDecorator('invoiceCode', {
                      initialValue: dataSource.invoiceCode,
                      rules: [
                        { required: true, message: '请输入10位发票代码',len:10 },
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
                    {getFieldDecorator('invoiceType', {
                      initialValue: dataSource.invoiceType,
                    })(<Select disabled={this.props.type === 'edit' ?true : false}>
                      <Option value="INVOICE">普票</Option>
                      <Option value="SPECIAL_INVOICE">专票</Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={12} key={8}>
                  <FormItem {...formItemLayout} label="开票日期">
                    {getFieldDecorator('billingDate', {
                      initialValue: dataSource.billingDate ? moment(dataSource.billingDate) :'',
                      rules: [
                        { required: true, message: '请选择开票日期' },
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
                      initialValue: dataSource.taxIncludeAmount,
                      rules: [
                        { required: true, message: '请输入含税金额'},
                      ]
                    })(<InputNumber style={{width: '220px'}} min={-999999999} max={999999999}/>)}
                  </FormItem>
                </Col>
                <Col span={12} key={10}>
                  <FormItem {...formItemLayout} label="不含税金额">
                    {getFieldDecorator('taxExcludeAmount', {
                      initialValue: dataSource.taxExcludeAmount,
                      rules: [
                        { required: true, message: '请输入不含税金额'},
                      ]
                    })(<InputNumber style={{width: '220px'}} min={-999999999} max={999999999}/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12} key={11}>
                  <FormItem {...formItemLayout} label="税率">
                    {getFieldDecorator('taxRate', {
                      initialValue: typeof dataSource.taxRate !== 'undefined' ? dataSource.taxRate + '' :  '',
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="TAX_RATE"
                        placeholder="税率"
                        hasEmpty
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col style={{textAlign: 'center',marginTop:'20px'}}>
                  <Button type="primary" onClick={()=>this.save()} loading={this.state.loading}>保存</Button>
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
