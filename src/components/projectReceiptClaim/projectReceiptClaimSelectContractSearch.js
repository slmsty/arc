/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, InputNumber, Table, Modal, Pagination } from 'antd'
import SelectCustomerWithForm from '../common/selectCustomer'
import requestJsonFetch from '../../http/requestJsonFecth'
import MultipleInput from '../common/multipleInput'

const columns = [{
  title: '客户名称',
  dataIndex: '1',
  key: '1',
  width: 100,
}, {
  title: '项目编码',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '合同编码',
  dataIndex: '7',
  key: '7',
  width: 100,
}, {
  title: '合同名称',
  dataIndex: '8',
  key: '8',
  width: 100,
}, {
  title: '项目阶段',
  dataIndex: '9',
  key: '9',
  width: 100,
}, {
  title: '付款百分比',
  dataIndex: '10',
  key: '10',
  width: 100,
}, {
  title: '发票号',
  dataIndex: '11',
  key: '11',
  width: 100,
}, {
  title: 'SBU',
  dataIndex: '12',
  key: '12',
  width: 100,
},
]

const FormItem = Form.Item
const InputGroup = Input.Group

class ProjectReceiptClaimSelectContract extends React.Component {
  state = {
    pageNo: 1,
    pageSize: 10,
    count: 1,
    result: [],
  }
  componentDidMount() {
  }
  handleChangePage = (page) => {
    this.handleQuery(page, this.state.pageSize)
  }
  handleChangeSize = (current, size) => {
    this.handleQuery(current, size)
  }
  handleQuery = (pageNo, pageSize) => {
    const queryParam = this.props.form.getFieldsValue()
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo,
          pageSize,
        },
        queryParam,
      },
    }
    requestJsonFetch('/arc/common/customer_name/list', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      console.log(response)
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const rowSelection = {
      type: 'checkBox',
    }
    const pagination = (<Pagination
      current={this.state.pageNo}
      onChange={this.handleChangePage}
      pageSize={this.state.pageSize}
      showSizeChanger
      onShowSizeChange={this.handleChangeSize}
      total={this.state.count}
    />)
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={800}
        title="查询合同百分比"
        visible={this.props.visible}
        onCancel={() => { this.props.onClose([]) }}
        footer={[
          <Button key="select" type="primary" onClick={this.handleSelectContract}>
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
                {getFieldDecorator('projectCode')(
                  <MultipleInput placeholder="多项目编码使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('customer')(
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
                {getFieldDecorator('contractCode')(
                  <MultipleInput placeholder="多合同编码使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="发票号">
                {getFieldDecorator('receiptCode')(
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
              <FormItem {...formItemLayout} label="金额范围">
                {getFieldDecorator('start')(
                  <InputGroup compact>
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
                    <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                  </InputGroup>,
                )}
              </FormItem>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          bordered
          size="middle"
          pagination="true"
          dataSource={this.state.result}
          scroll={{ x: '150%' }}
        />
      </Modal>
    )
  }
}

ProjectReceiptClaimSelectContract.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

const ProjectReceiptClaimSelectContractWithForm = Form.create()(
  ProjectReceiptClaimSelectContract,
)

export default ProjectReceiptClaimSelectContractWithForm
