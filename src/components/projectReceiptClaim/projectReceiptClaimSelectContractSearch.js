/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, InputNumber, Table, Modal } from 'antd'
import SelectCustomerWithForm from '../common/selectCustomer'

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

class ProjectReceiptClaimSelectContract extends React.Component {
  componentDidMount() {
  }
  onSelectCustomer = (customer) => {
    console.log(customer)
  }
  handleQuery = () => {
    const customer = this.props.form.getFieldValue('customer')
    console.log(customer)
  }
  handleSelectContract = () => {
    console.log('')
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const rowSelection = {
      type: 'checkBox',
    }
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
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="项目编码">
                {getFieldDecorator('projectCode')(
                  <Input placeholder="多项目编码使用英文逗号间隔" />,
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
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="合同编码">
                {getFieldDecorator('contractCode')(
                  <Input placeholder="多合同编码使用英文逗号间隔" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="发票号">
                {getFieldDecorator('receiptCode')(
                  <Input placeholder="多发票号使用英文逗号间隔" />,
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
          <Row gutter={40}>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="金额从">
                {getFieldDecorator('start')(
                  <InputNumber />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="到">
                {getFieldDecorator('end')(
                  <InputNumber />,
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="query" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          bordered
          size="middle"
          pagination="true"
          scroll={{ x: '150%', y: true }}
        />
      </Modal>
    )
  }
}

ProjectReceiptClaimSelectContract.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

const ProjectReceiptClaimSelectContractWithForm = Form.create()(
  ProjectReceiptClaimSelectContract,
)

export default ProjectReceiptClaimSelectContractWithForm
