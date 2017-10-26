/* eslint-disable react/prefer-stateless-function,react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const Search = Input.Search

const columns = [{
  title: '公司名称',
  dataIndex: '1',
  key: '1',
  width: 100,
}, {
  title: '公司编号',
  dataIndex: '2',
  key: '2',
  width: 100,
}, {
  title: '所属BG',
  dataIndex: '3',
  key: '3',
  width: 100,
},
]

class SelectReceiptCompany extends React.Component {
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
          placeholder="认款公司"
          value={this.state.customer}
          onChange={value => this.props.onChange(value)}
          onSearch={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择认款公司"
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />选择认款公司
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="公司名称">
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

SelectReceiptCompany.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
}

const SelectReceiptCompanyWithForm = Form.create()(SelectReceiptCompany)

export default SelectReceiptCompanyWithForm
