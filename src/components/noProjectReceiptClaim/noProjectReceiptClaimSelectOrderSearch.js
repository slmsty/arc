/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, InputNumber, Table, Modal } from 'antd'
import SelectCustomerWithForm from '../common/selectCustomer'
import ClearInput from '../common/clearInput'

const FormItem = Form.Item

class NoProjectReceiptClaimSelectOrder extends React.Component {
  state = {
    pageSize: 10,
    selectedRowKeys: [],
    selectedRows: [],
    loading: false,
    firstLoad: true,
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.getOrderCompleted !== nextProps.getOrderCompleted) {
      this.setState({ loading: false, firstLoad: false })
    }
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.props.form.resetFields()
      this.handleQuery()
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '客户名称',
    dataIndex: 'custName',
    width: 200,
  }, {
    title: '订单号',
    dataIndex: 'projectNo',
    width: 150,
  }, {
    title: '支付方式',
    dataIndex: 'contractNo',
    width: 100,
  }, {
    title: '应收金额',
    dataIndex: 'arAmount',
    width: 100,
  }, {
    title: '应收余额',
    dataIndex: 'arAmount1',
    width: 100,
  },
  ]
  handleChangePage = (page) => {
    this.handleSelect(page, this.state.pageSize)
  }
  handleQuery = () => {
    this.handleSelect(1, this.state.pageSize)
  }
  handleSelect = (pageNo, pageSize) => {
    const param = { ...this.props.form.getFieldsValue(),
      pageInfo: {
        pageNo,
        pageSize,
      },
    }
    this.props.getOrder(param)
    this.setState({ loading: true })
  }
  handleSelectFunds = () => {
    this.props.onClose(this.state.selectedRows)
    this.setState({ selectedRowKeys: [], selectedRows: [] })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={800}
        title="查询订单"
        visible={this.props.visible}
        onCancel={() => { this.props.onClose([]) }}
        footer={[
          <Button key="select" type="primary" onClick={this.handleSelectFunds}>
            <Icon type="check" />选择订单
          </Button>,
        ]}
      >
        <Form
          className="ant-search-form"
        >
          <Row>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="金额从">
                {getFieldDecorator('amountMin')(
                  <ClearInput onPressEnter={this.handleQuery} />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="金额到">
                {getFieldDecorator('amountMax')(
                  <ClearInput onPressEnter={this.handleQuery} />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户">
                {getFieldDecorator('custId')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="订单号">
                {getFieldDecorator('projectNo')(
                  <Input onPressEnter={this.handleQuery} />,
                )}
              </FormItem>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="fundId"
          rowSelection={rowSelection}
          columns={this.columns}
          bordered
          size="middle"
          loading={this.state.loading}
          locale={{
            emptyText: this.state.firstLoad ? '' : '没有符合条件的订单',
          }}
          pagination={{
            current: this.props.receiptClaimOrderList.pageNo,
            total: this.props.receiptClaimOrderList.count,
            pageSize: this.state.pageSize,
            onChange: this.handleChangePage,
          }}
          dataSource={this.props.receiptClaimOrderList.result}
          scroll={{ y: '400' }}
        />
      </Modal>
    )
  }
}

NoProjectReceiptClaimSelectOrder.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  receiptClaimOrderList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getOrder: PropTypes.func.isRequired,
  getOrderCompleted: PropTypes.number.isRequired,
}

const NoProjectReceiptClaimSelectOrderWithForm = Form.create()(
  NoProjectReceiptClaimSelectOrder,
)

export default NoProjectReceiptClaimSelectOrderWithForm

