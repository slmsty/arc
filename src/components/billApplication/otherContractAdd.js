import React from 'react'
import { Form, Button, Row, Col, Modal, Icon } from 'antd'
import SelectSearch from './selectSearch'
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

class OtherContractAdd extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: ''
    }
  }

  handleOk = () => {
    const values = this.props.form.getFieldsValue()
    const params = {
      billingApplicationType: this.props.billType,
      custName: values.custName[1],
      comName: values.comName[1],
    }
    console.log(params)
    this.props.addAction(params)
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
          title="其他合同新增"
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
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(OtherContractAdd)
