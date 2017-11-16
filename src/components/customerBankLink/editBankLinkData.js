/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input } from 'antd'

import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item

class EditBankLinkData extends React.Component {
  state = {
  }
  componentDidMount() {
    // this.setFormValues()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.editModalData !== nextProps.editModalData) {
      // this.setFormValues()
    }
  }
  setFormValues = () => {
    const modalData = this.props.editModalData
    console.log(modalData)
    modalData.erpCustId = [modalData.erpCustId, modalData.erpCustName]
    // 赋值给modal
    const { custBankName, erpCustId, custBankAccount, sourceType } = modalData
    const x = { custBankName, erpCustId, custBankAccount, sourceType }
    this.props.form.setFieldsValue(x)
  }
  handleSubmit = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        this.setState({
          editVisible: false,
        })
        const addData = this.props.form.getFieldsValue() // 获取modal数据
        const custId = this.props.form.getFieldValue('erpCustId')
        // 处理数据
        if (custId) {
          addData.erpCustId = custId[0]
          addData.erpCustName = custId[1]
        }
        const postAddData = {}
        postAddData.arcBankCust = addData
        this.props.queryParams(postAddData)
      }
    })
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    const { getFieldDecorator } = this.props.form
    const modalData = this.props.editModalData
    // console.log('modal data', modalData)
    return (
      <div>
        <Modal
          title={this.props.title}
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.handleSubmit}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={40}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('erpCustId', {
                    rules: [{ required: true, message: '请输入客户名称!' }],
                    initialValue: [modalData.erpCustId, modalData.erpCustName],
                  })(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="银行名称">
                  {getFieldDecorator('custBankName', {
                    rules: [{ required: true, message: '请输入银行名称!' }],
                    initialValue: modalData.custBankName,
                  })(
                    <Input
                      placeholder="请输入银行名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={12} key={3}>
                <FormItem {...formItemLayout} label="银行帐号">
                  {getFieldDecorator('custBankAccount', {
                    rules: [{ pattern: /^[+]{0,1}(\d+)$/, required: true, message: '请输入正确银行帐号' }],
                    initialValue: modalData.custBankAccount,
                  })(
                    <Input
                      placeholder="请输入银行帐号"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={5}>
                <FormItem {...formItemLayout} label="关系来源">
                  {getFieldDecorator('sourceType', {
                    rules: [{ required: true, message: '请输入关系来源!' }],
                    initialValue: modalData.sourceType,
                  })(
                    <Input
                      placeholder="请输入关系来源"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* <Row gutter={40}>
             <Col span={12} key={3}>
             <FormItem {...formItemLayout} label="数据状态">
             {getFieldDecorator('status', {
             initialValue: '1',
             })(
             <Select
             placeholder="请选择数据状态"
             notFoundContent=""
             defaultActiveFirstOption={false}
             filterOption={false}
             onChange={this.handleChange}
             >
             <Option value="1">有效</Option>
             <Option value="0">无效</Option>
             </Select>,
             )}
             </FormItem>
             </Col>
             </Row> */}
            {getFieldDecorator('bankCustId')(
              <Input
                type="hidden"
              />,
            )}
          </Form>
        </Modal>
      </div>
    )
  }
}

EditBankLinkData.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
  queryParams: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
}
const EditBankLinkDataWithForm = Form.create()(EditBankLinkData)

export default EditBankLinkDataWithForm
