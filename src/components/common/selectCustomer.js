/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, Pagination, notification } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const Search = Input.Search

const columns = [{
  title: '客户名称',
  dataIndex: '1',
  key: '1',
  width: 100,
}, {
  title: '客户编号',
  dataIndex: '2',
  key: '2',
  width: 100,
},
]

class SelectCustomer extends React.Component {
  state = {
    visible: false,
    pageNo: 1,
    pageSize: 10,
    count: 1,
    customerList: [],
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
  handleChangePage = (page) => {
    this.setState({
      pageNo: page,
    })
    this.handleQuery()
  }
  handleQuery = () => {
    const keywords = this.props.form.getFieldValue('keywords')
    const param = {
      pageInfo: {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
      },
      keywords,
    }
    requestJsonFetch('arc/common/customer_name/list', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      console.log(response)
    }
  }
  render() {
    const { visible } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const pagination = (<Pagination
      current={this.state.pageNo}
      onChange={this.handleChangePage}
      total={this.state.count}
    />)
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      type: 'radio',
    }
    return (
      <div>
        <Search
          style={{ height: 30 }}
          placeholder="客户名称"
          value={this.state.customer}
          onChange={value => this.props.onChange(value)}
          onSearch={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择客户"
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />选择客户
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('keywords')(
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
            pagination={pagination}
          />
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
