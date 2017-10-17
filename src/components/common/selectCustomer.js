/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const Search = Input.Search
class SelectCustomer extends React.Component {
  state = {
    visible: false,
    customer: '',
  }
  handleOk = () => {
    this.setState({
      customer: 'abcdefg',
    })
    this.props.onChange('abcdefg')
    this.handleCancel()
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  handleQuery = () => {
    const customerName = this.props.form.getFieldValue('customerName')
    requestJsonFetch('aaaa', customerName, this.handleCallback)
  }
  handleCallback = (response) => {
    console.log(response)
  }
  render() {
    const { visible } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Search
          placeholder="客户名称"
          value={this.state.customer}
          onChange={value => this.props.onChange(value)}
          onSearch={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择客户"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
              选择客户
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
            onSubmit={this.handleSearch}
          >
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('customerName')(
                    <Input
                      placeholder="客户名称"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={1} key={2} />
              <Col span={7} key={3}>
                <Button type="primary" icon="search" htmlType="submit" onClick={this.handleQuery}>查询</Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

SelectCustomer.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

const SelectCustomerWithForm = Form.create()(SelectCustomer)

export default SelectCustomerWithForm
