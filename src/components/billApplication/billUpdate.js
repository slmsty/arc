import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Modal, Icon } from 'antd'
import SelectClient from './selectClient'
import SelectCompany from './selectCompany'
import SelectInvokeApi from '../common/selectInvokeApi'
const Option = Select.Option
const FormItem = Form.Item
const TextArea = Input.TextArea


class BillUpdate extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: ''
    }
  }

  handleOk = () => {
    const values = this.props.form.getFieldsValue()
    const params = {
      ...values,
      arBillingId: this.props.arBillingId,
      receiptReturnDate: values.receiptReturnDate ? values.receiptReturnDate.format('YYYY-MM-DD') : '',
    }
    console.log(params)
    this.props.updateBillInfo(params)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Modal
          width="650px"
          title="发票编辑"
          visible={this.props.visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />保存
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="签约公司">
                  {getFieldDecorator('comName')(<SelectCompany />)}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="客户名称">
                  {
                    getFieldDecorator('custName',{
                      initialValue: '',
                    })(<SelectClient />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="提前开票原因">
                  {
                    getFieldDecorator('advanceBillingReason',{
                      initialValue: '',
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="ADVANCE_BILLING_REASON"
                        placeholder="提前开票原因"
                        hasEmpty
                        onChange={(value) => this.setState({reasonId: value})}
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="预计回款日期">
                  {
                    getFieldDecorator('receiptReturnDate')(<DatePicker format="YYYY-MM-DD"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="项目编码">
                  {getFieldDecorator('tempProjectId')(
                    <SelectCompany />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="关联发票">
                  {
                    getFieldDecorator('billingOutcomeId',{
                      initialValue: '',
                    })(<SelectClient />)
                  }
                </FormItem>
              </Col>
            </Row>
            {
              this.state.reasonId === 'other' ?
                <Row gutter={30}>
                  <Col span={12} key={1}>
                    <FormItem {...formItemLayout} label="提前开票备注">
                      {getFieldDecorator('advanceBillingRemark')(
                        <Input placeholder="提前开票备注"/>
                      )}
                    </FormItem>
                  </Col>
                </Row> : null
            }
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(BillUpdate)
