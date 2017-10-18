/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const Search = Input.Search

const columns = [{
  title: '收款方法',
  dataIndex: '1',
  key: '1',
  width: 100,
}, {
  title: '银行账号',
  dataIndex: '2',
  key: '2',
  width: 100,
},
]

class SelectReceiptMethod extends React.Component {
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
    const rowSelection = {
      type: 'radio',
    }
    return (
      <div>
        <Search
          style={{ height: 30 }}
          placeholder="收款方法"
          value={this.state.customer}
          onChange={value => this.props.onChange(value)}
          onSearch={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择收款方法"
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />选择收款方法
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="收款方法">
                  {getFieldDecorator('customerName')(
                    <Input
                      placeholder="请输入关键字"
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

          <Table
            columns={columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            pagination="true"
          />
        </Modal>
      </div>
    )
  }
}

SelectReceiptMethod.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

const SelectReceiptMethodWithForm = Form.create()(SelectReceiptMethod)

export default SelectReceiptMethodWithForm
