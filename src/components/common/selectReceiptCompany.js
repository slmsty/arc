/* eslint-disable react/prefer-stateless-function,react/prop-types,react/require-default-props,max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class SelectReceiptCompany extends React.Component {
  state = {
    visible: false,
    pageNo: 1,
    pageSize: 10,
    total: 1,
    companyList: [],
    selectedRowKeys: [],
    selectedRows: [],
  }
  componentWillMount() {
    if (this.props.initialValue) {
      this.props.onChange(this.props.initialValue)
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
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
  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择认款公司')
      return
    }
    this.props.onChange([this.state.selectedRows[0].receiptCompanyId, this.state.selectedRows[0].customerName])
    this.handleCancel()
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
    })
  }
  handleChangePage = (page) => {
    this.handleQueryFetch(page)
  }
  handleQuery = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    this.handleQueryFetch(1)
  }
  handleQueryFetch= (pageNo) => {
    const keywords = this.props.form.getFieldValue('keywords')
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageNo || 1,
          pageSize: this.state.pageSize,
        },
        keywords,
      },
    }
    requestJsonFetch('/arc/common/receipt_method/list', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.pageCount,
        companyList: response.pageInfo.result,
      })
    }
  }
  handleEmitEmpty = () => {
    this.props.onChange('')
  }
  render() {
    const { visible } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const value = (this.props.value && this.props.value[0] !== undefined) ? this.props.value : this.props.initialValue
    const suffix = value && value[0] !== undefined ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={() => this.setState({ visible: true })} />
    return (
      <div>
        <Input
          style={{ height: 30 }}
          placeholder="认款公司"
          value={value && value[0] !== undefined ? value[1] : ''}
          suffix={suffix}
          onClick={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择认款公司"
          style={{ top: 20 }}
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
                <FormItem {...formItemLayout} label="认款公司">
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
            rowKey="receiptCompanyId"
            columns={this.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.companyList}
            pagination={{
              current: this.state.pageNo,
              onChange: this.handleChangePage,
              total: this.state.total,
              size: 'small',
            }}
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
  value: PropTypes.arrayOf(PropTypes.string),
  initialValue: PropTypes.arrayOf(PropTypes.string),
}

const SelectReceiptCompanyWithForm = Form.create()(SelectReceiptCompany)

export default SelectReceiptCompanyWithForm
