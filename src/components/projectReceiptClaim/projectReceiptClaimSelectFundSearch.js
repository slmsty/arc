/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, InputNumber, Table, Modal, Pagination } from 'antd'
import SelectCustomerWithForm from '../common/selectCustomer'
import MultipleInput from '../common/multipleInput'

const FormItem = Form.Item

class ProjectReceiptClaimSelectFund extends React.Component {
  state = {
    pageSize: 10,
    selectedRowKeys: [],
    selectedRows: [],
  }
  componentDidMount() {
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '客户名称',
    dataIndex: 'custName',
    width: 100,
  }, {
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 100,
  }, {
    title: '合同编码',
    dataIndex: 'contractNo',
    width: 100,
  }, {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 100,
  }, {
    title: '项目阶段',
    dataIndex: 'paymentPhrases',
    width: 100,
  }, {
    title: '付款百分比',
    dataIndex: 'paymentPercent',
    width: 100,
  }, {
    title: '发票号',
    dataIndex: 'invoiceNo',
    width: 100,
  }, {
    title: 'SBU',
    dataIndex: 'sbuId',
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
    this.props.getPhase(param)
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
        title="查询合同百分比"
        visible={this.props.visible}
        onCancel={() => { this.props.onClose([]) }}
        footer={[
          <Button key="select" type="primary" onClick={this.handleSelectFunds}>
            <Icon type="check" />选择合同百分比
          </Button>,
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
                {getFieldDecorator('custId')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="SBU">
                {getFieldDecorator('sbu')(
                  <Input />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="合同编码">
                {getFieldDecorator('contractNos')(
                  <MultipleInput placeholder="多合同编码使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="发票号">
                {getFieldDecorator('placeholder')(
                  <MultipleInput placeholder="多发票号使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="部门">
                {getFieldDecorator('dept')(
                  <Input />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="金额从">
                {getFieldDecorator('amountMin')(
                  <InputNumber />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="金额到">
                {getFieldDecorator('amountMax')(
                  <InputNumber />,
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
          size="middle"
          pagination={{
            current: this.props.receiptClaimFundList.pageNo,
            total: this.props.receiptClaimFundList.count,
            pageSize: this.state.pageSize,
            onChange: this.handleChangePage,
          }}
          dataSource={this.props.receiptClaimFundList.result}
          scroll={{ x: '150%' }}
        />
      </Modal>
    )
  }
}

ProjectReceiptClaimSelectFund.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  receiptClaimFundList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getPhase: PropTypes.func.isRequired,
}

const ProjectReceiptClaimSelectFundWithForm = Form.create()(
  ProjectReceiptClaimSelectFund,
)

export default ProjectReceiptClaimSelectFundWithForm
