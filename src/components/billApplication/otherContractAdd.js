import React from 'react'
import { Form, Button, Row, Col, Modal, Icon, Input } from 'antd'
import InputSearch from './inputSearch'
import SelectSearch from './selectSearch'
import SelectInvokeApi from '../common/selectInvokeApi'
import { clientCols, comCols, proCols } from './billColumns'
const FormItem = Form.Item

class OtherContractAdd extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: ''
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    const { isAdd, record } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = isAdd ? {
          ...values,
          billingApplicationType: this.props.billType,
          custName: values.custName[1],
          comName: values.comName[1],
          projectNo: values.projectNo ? values.projectNo.tempProjectNo : '',
          sbuNo: values.projectNo ? values.projectNo.sbuNo : '',
          sbuName: values.projectNo ? values.projectNo.sbuName : '',
          costcenterNo: values.projectNo ? values.projectNo.costcenterNo : '',
          costcenterName: values.projectNo ? values.projectNo.costcenterName : '',
          tempProjectId: values.projectNo ? values.projectNo.tempProjectId : '',
        } : {
          ...values,
          billingApplicationType: this.props.billType,
          arBillingId: record.arBillingId,
          custName: values.custName[1],
          comName: values.comName[1],
          projectNo: values.projectNo ? values.projectNo.tempProjectNo : '',
          sbuNo: values.projectNo ? values.projectNo.sbuNo : '',
          sbuName: values.projectNo ? values.projectNo.sbuName : '',
          costcenterNo: values.projectNo ? values.projectNo.costcenterNo : '',
          costcenterName: values.projectNo ? values.projectNo.costcenterName : '',
          tempProjectId: values.projectNo ? values.projectNo.tempProjectId : '',
        }
        this.props.addAction(params)
      }
    });

  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { comName, custName, projectNo, contractCurrency } = this.props.record
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Modal
          width="650px"
          title="其他合同新增"
          visible={this.props.visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" onClick={(e) => this.handleOk(e)}>
              <Icon type="check" />保存
            </Button>,
          ]}
          maskClosable={false}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="签约公司">
                  {getFieldDecorator('comName', {initialValue: ['', comName], rules: [{ required: true, message: '请选择签约公司!' }]})(
                    <SelectSearch
                      url="/arc/billingApplication/company/search"
                      columns={comCols}
                      label="公司名称"
                      idKey="billingComInfoId"
                      valueKey="comName"
                      showSearch={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="客户名称">
                  {
                    getFieldDecorator('custName',{
                      initialValue: ['', custName], rules: [{ required: true, message: '请选择客户名称!' }]
                    })(
                      <SelectSearch
                        url="/arc/billingApplication/custom/search"
                        columns={clientCols}
                        label="客户名称"
                        idKey="custId"
                        valueKey="custName"
                        width='800px'
                        showSearch={true}
                      />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="项目编码">
                  {getFieldDecorator('projectNo', {initialValue: {tempProjectNo: projectNo}, rules: [{ required: true, message: '请选择项目编码!' }]})(
                    <InputSearch
                      url="/arc/billingApplication/projectNo/search"
                      columns={proCols}
                      label="项目编码"
                      idKey="tempProjectId"
                      valueKey="tempProjectNo"
                      billType={this.props.billType}
                      width="800px"
                      showSearch={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="币种">
                  {getFieldDecorator('contractCurrency', { initialValue : contractCurrency, rules: [{ required: true, message: '请选择币种!' }]})(
                    <SelectInvokeApi
                      typeCode="COMMON"
                      paramCode="CURRENCY"
                      placeholder="请选择币种"
                      hasEmpty
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(OtherContractAdd)
