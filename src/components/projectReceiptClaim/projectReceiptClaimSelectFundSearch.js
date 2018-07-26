/* eslint-disable no-unused-vars,react/prefer-stateless-function,max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, InputNumber, Table, Modal, Pagination } from 'antd'
import SelectCustomerWithForm from '../common/selectCustomer'
import MultipleInput from '../common/multipleInput'
import ClearInput from '../common/clearInput'

const FormItem = Form.Item

class ProjectReceiptClaimSelectFund extends React.Component {
  state = {
    pageSize: 5,
    selectedRowKeys: [],
    selectedRows: [],
    loading: false,
    firstLoad: true,
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.getPhaseCompleted !== nextProps.getPhaseCompleted) {
      this.setState({ loading: false, firstLoad: false })
    }
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.handleResetFields()
      this.handleQuery()
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 20,
    fixed: 'left',
  }, {
    title: '节点',
    dataIndex: 'projectNode',
    width: 20,
    fixed: 'left',
  }, {
    title: '付款条款',
    dataIndex: 'paymentName',
    width: 20,
    fixed: 'left',
  }, {
    title: '款项状态',
    dataIndex: 'paymentStatus',
    width: 20,
    fixed: 'left',
  }, {
    title: '付款百分比',
    dataIndex: 'paymentPercent',
    width: 100,
  }, {
    title: '合同币种',
    dataIndex: 'contractCurrency',
    width: 100,
  }, {
    title: '应收金额',
    dataIndex: 'arAmount',
    width: 100,
    render: text => (text ? text.toFixed(2) : 0.00),
  }, {
    title: '应收余额',
    dataIndex: 'receivableBalance',
    width: 100,
    render: text => (text ? text.toFixed(2) : 0.00),
  }, {
    title: '应收日期',
    dataIndex: 'arDate',
    width: 100,
  }, {
    title: '客户名称',
    dataIndex: 'custName',
    width: 100,
  }, {
    title: '合同编码',
    dataIndex: 'contractNo',
    width: 100,
  }, {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 200,
  }, {
    title: 'SBU',
    dataIndex: 'sbuId',
    width: 100,
  }, {
    title: '部门',
    dataIndex: 'deptName',
    width: 100,
  }, {
    title: '项目经理',
    dataIndex: 'manager',
    width: 100,
  }, {
    title: '发票号',
    dataIndex: 'invoiceNo',
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
    const queryParam = this.props.form.getFieldsValue()
    if (queryParam.cust) {
      queryParam.custName = queryParam.cust[1]
      delete queryParam.cust
    }
    const param = { ...queryParam,
      pageInfo: {
        pageNo,
        pageSize,
      },
    }
    this.props.getPhase(param)
    this.setState({ loading: true })
  }
  handleSelectFunds = () => {
    this.props.onClose(this.state.selectedRows)
    this.handleResetFields()
  }
  handleResetFields = () => {
    this.props.form.resetFields()
    this.props.form.setFieldsValue({
      projectNos: [],
      contractNos: [],
      placeholder: [],
    })
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
      getCheckboxProps: record => ({
        disabled: record.receivableBalance == 0,
      }),
      onChange: this.onSelectChange,
    }
    const amountTotals = {}
    this.state.selectedRows.forEach((fund) => {
      if (amountTotals[fund.contractCurrency]) {
        amountTotals[fund.contractCurrency] += fund.arAmount
      } else {
        amountTotals[fund.contractCurrency] = fund.arAmount
      }
    })
    const makeSummary = Object.keys(amountTotals).map(contractCurrency => `${contractCurrency}:${amountTotals[contractCurrency].toFixed(2)}  `)
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={800}
        title="查询合同百分比"
        visible={this.props.visible}
        onCancel={() => {this.props.onClose([]);this.handleResetFields()}}
        footer={[
          <Row style={{ lineHeight: '28px' }}>
            <Col span={19} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
              <span>应收金额合计：</span><span className="primary-color" style={{ color: '#F4A034' }}>{makeSummary}</span>
            </Col>
            <Col span={5}>
              <Button key="select" type="primary" onClick={this.handleSelectFunds}>
                <Icon type="check" />选择合同百分比
              </Button>,
            </Col>
          </Row>,
        ]}
      >
        <Form
          className="ant-search-form"
          onSubmit={this.handleSearch}
        >
          <Row>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="项目编码">
                {getFieldDecorator('projectNos')(
                  <MultipleInput placeholder="多项目编码使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户">
                {getFieldDecorator('cust', {
                  initialValue: [this.props.receiptInfo.payCustId, this.props.receiptInfo.payCustName],
                })(
                  <SelectCustomerWithForm
                    defaultQueryParam={this.props.receiptInfo.payCustName}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="SBU">
                {getFieldDecorator('sbu' ,{initialValue: ''})(
                  <Input onPressEnter={this.handleQuery} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="合同编码">
                {getFieldDecorator('contractNos', {initialValue: ''})(
                  <MultipleInput placeholder="多合同编码使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="发票号">
                {getFieldDecorator('placeholder', {initialValue: ''})(
                  <MultipleInput placeholder="多发票号使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="部门">
                {getFieldDecorator('dept', {initialValue: ''})(
                  <Input onPressEnter={this.handleQuery} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="金额从">
                {getFieldDecorator('amountMin', {
                  initialValue: this.props.receiptInfo.receiptAmount,
                })(
                  <ClearInput onPressEnter={this.handleQuery} />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="金额到">
                {getFieldDecorator('amountMax', {
                  initialValue: this.props.receiptInfo.receiptAmount,
                })(
                  <ClearInput onPressEnter={this.handleQuery} />,
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="fundId"
          rowSelection={rowSelection}
          columns={this.columns}
          bordered
          size="small"
          loading={this.state.loading}
          locale={{
            emptyText: this.state.firstLoad ? '' : '没有符合条件的合同百分比',
          }}
          dataSource={this.props.receiptClaimFundList.result}
          scroll={{ x: '100%' }}
          pagination={{
            current: this.props.receiptClaimFundList.pageNo,
            total: this.props.receiptClaimFundList.count,
            pageSize: this.state.pageSize,
            showTotal: (total, range) => `共 ${total} 条记录 当前显示 ${range[0]}-${range[1]}`,
            onChange: this.handleChangePage,
          }}
        />
      </Modal>
    )
  }
}

ProjectReceiptClaimSelectFund.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  receiptClaimFundList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
  receiptInfo: PropTypes.shape({
    payCustId: PropTypes.string,
    payCustName: PropTypes.string,
    receiptAmount: PropTypes.number,
  }).isRequired,
  getPhaseCompleted: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getPhase: PropTypes.func.isRequired,
}

const ProjectReceiptClaimSelectFundWithForm = Form.create()(
  ProjectReceiptClaimSelectFund,
)

export default ProjectReceiptClaimSelectFundWithForm
