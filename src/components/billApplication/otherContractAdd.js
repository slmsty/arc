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
      reasonId: '',
      saveLoading: false,
       cId:'',
      cName:'',
    }
  }
componentDidMount(){
   if(this.props.record.projectNo&&!this.props.record.comId)
   {
 this.setState({cId:'已开票'})

  
   }
else{
  this.setState({cId:this.props.record.comId?this.props.record.comId:''})
}

}  handleOk = (e) => {
    e.preventDefault();
    const { isAdd, record } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = isAdd ? {
          ...values,
          billingApplicationType: this.props.billType,
          billingComInfoId: values.comName[0],
          comName: values.comName[1],
          billingCustInfoId: values.custName[0],
          custName: values.custName[1],
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
          billingComInfoId: values.comName[0],
          billingCustInfoId: values.custName[0],
          custName: values.custName[1],
          comName: values.comName[1],
          projectNo: values.projectNo ? values.projectNo.tempProjectNo : '',
          sbuNo: values.projectNo ? values.projectNo.sbuNo : '',
          sbuName: values.projectNo ? values.projectNo.sbuName : '',
          costcenterNo: values.projectNo ? values.projectNo.costcenterNo : '',
          costcenterName: values.projectNo ? values.projectNo.costcenterName : '',
          tempProjectId: values.projectNo ? values.projectNo.tempProjectId : '',
        }
        this.setState({
          saveLoading: true
        })
        this.props.addAction(params).then(res => {
          if(res && res.response) {
            this.setState({
              saveLoading: false
            })
          }
        })
      }
    });

  }
companyName=(id,value)=>{
this.setState({ cId:id,
      cName:value,});
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
            <Button key="submit" type="primary" loading={this.state.saveLoading} onClick={(e) => this.handleOk(e)}>
              {!this.state.saveLoading ? <Icon type="check" /> : ''}保存
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
                       companyName={this.companyName}
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
                        idKey="billingCustInfoId"
                        valueKey="custName"
                        width='800px'
                        showSearch={true}
                        cId={this.state.cId}
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
                      cId={this.state.cId}
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
