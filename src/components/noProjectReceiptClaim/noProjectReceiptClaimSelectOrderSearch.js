/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, InputNumber, Table, Modal, Select } from 'antd'
import SelectCustomerWithForm from '../common/selectCustomer'

const columns = [{
  title: '客户名称',
  dataIndex: '1',
  key: '1',
  width: 100,
}, {
  title: '订单号',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '客户支付方式',
  dataIndex: '7',
  key: '7',
  width: 100,
}, {
  title: '应收金额',
  dataIndex: '8',
  key: '8',
  width: 100,
}, {
  title: '应收余额',
  dataIndex: '9',
  key: '9',
  width: 100,
},
]

const FormItem = Form.Item

class NoProjectReceiptClaimSelectOrder extends React.Component {
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
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const rowSelection = {
      type: 'checkBox',
    }
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={800}
        title="查询订单"
        visible={this.props.visible}
        onCancel={() => { this.props.onClose([]) }}
        footer={[
          <Button key="select" type="primary" onClick={this.handleSelectContract}>
            <Icon type="check" />选择订单
          </Button>,
        ]}
      >
        <Form
          className="ant-search-form"
          onSubmit={this.handleSearch}
        >
          <Row>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('customer')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="来源系统">
                {getFieldDecorator('sbu')(
                  <Select />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
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
          scroll={{ x: '150%', y: true }}
        />
      </Modal>
    )
  }
}

NoProjectReceiptClaimSelectOrder.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

const NoProjectReceiptClaimSelectOrderWithForm = Form.create()(
  NoProjectReceiptClaimSelectOrder,
)

export default NoProjectReceiptClaimSelectOrderWithForm
