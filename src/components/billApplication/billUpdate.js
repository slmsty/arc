import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Modal, Icon } from 'antd'
import SelectSearch from './selectSearch'
import SelectInvokeApi from '../common/selectInvokeApi'
const FormItem = Form.Item
const clientCols = [{
  title: '客户名称',
  dataIndex: 'custName',
  width: 200,
}, {
  title: '客户编号',
  dataIndex: 'custId',
  width: 200,
}]
const comCols = [{
  title: '公司名称',
  dataIndex: 'comName',
  width: 200,
}, {
  title: '公司编号',
  dataIndex: 'comId',
  width: 200,
}]
const proCols = [{
  title: '项目编码',
  dataIndex: 'projectNo',
  width: 200,
}]


class BillUpdate extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: ''
    }
  }

  handleOk = () => {
    const values = this.props.form.getFieldsValue()
    const { arBillingId, contractItemId, isAdd } = this.props;
    const params = isAdd ? {
      ...values,
      comName: values.comName[1],
      custName: values.custName[1],
      projectNo: values.projectNo[1],
      receiptReturnDate: values.receiptReturnDate ? values.receiptReturnDate.format('YYYY-MM-DD') : '',
    } : {
      ...values,
      arBillingId: arBillingId,
      contractItemId: contractItemId,
      comId: values.comName[0],
      comName: values.comName[1],
      custId: values.custName[0],
      custName: values.custName[1],
      receiptReturnDate: values.receiptReturnDate ? values.receiptReturnDate.format('YYYY-MM-DD') : '',
    }
    console.log(params)
    this.props.billAction(params)
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
          title={this.props.isAdd ? '发票添加' : '发票编辑'}
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
                  {getFieldDecorator('comName')(
                    <SelectSearch
                      url="/arc/billingApplication/company/search"
                      columns={comCols}
                      label="公司名称"
                      idKey="comId"
                      valueKey="comName"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="客户名称">
                  {
                    getFieldDecorator('custName',{
                      initialValue: '',
                    })(
                      <SelectSearch
                        url="/arc/billingApplication/custom/search"
                        columns={clientCols}
                        label="客户名称"
                        idKey="custId"
                        valueKey="custName"
                    />)
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
                  {getFieldDecorator('projectNo')(
                    <SelectSearch
                      url="/arc/billingApplication/projectNo/search"
                      columns={proCols}
                      label="项目编码"
                      idKey="projectNo"
                      valueKey="projectNo"
                    />
                  )}
                </FormItem>
              </Col>
              {
                !this.props.isAdd ?
                  <Col span={12} key={2}>
                    <FormItem {...formItemLayout} label="关联发票">
                      {
                        getFieldDecorator('billingOutcomeId',{
                          initialValue: '',
                        })(<SelectSearch
                          url="/arc/billingApplication/outcome/search"
                          columns={proCols}
                          label="发票抬头"
                          idKey="custId"
                          valueKey="custName"
                        />)
                      }
                    </FormItem>
                  </Col> : null
              }
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
