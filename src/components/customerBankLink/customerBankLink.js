/**
 * Created by liangshuang on 17/10/20.
 */
/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal, Form, Row, Col, Input, notification } from 'antd'
import CustomerBankLinkWithForm from './customerBankLinkSearch'
import EditBankLinkData from './editBankLinkData'
import SelectCustomerWithForm from '../common/selectCustomer'


const data = []
const FormItem = Form.Item
// 显示提示
const showNotificationWithIcon = (msg) => {
  notification.error({
    message: '错误',
    description: msg,
  })
}
class CustomerBankLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      delVisible: false,
      editVisible: false,
      selectedRow: [],
      edittitle: '',
      selectedRows: [],
      delDataLength: '',
    }
  }

  componentDidMount() {
    this.testData()
  }
  handleQuery = (record) => {
  }
  // 显示人工添加modal
  showAutoAdd = () => {
    this.setState({
      editVisible: true,
      edittitle: '人工添加客户银行关系数据',
    })
  }
  handleAutoAddOk = () => {
    this.setState({
      editVisible: false,
    })
    const addData = this.props.form.getFieldsValue()
    // 提交数据
    console.log('add')
    console.log(this.props.form.getFieldsValue())
  }
  // 显示编辑客户银行关系modal
  showEditModal = (record, e) => {
    this.setState({
      editVisible: true,
      edittitle: '编辑客户银行关系数据',
    })
    this.props.form.setFieldsValue(record)
  }
  // 提交编辑客户银行关系数据 关闭modal
  handleEditOk = (record) => {
    this.setState({
      editVisible: false,
    })
    const newEditData = this.props.form.getFieldsValue()
    console.log('edit')
    console.log(newEditData)// 提交给后台接口
  }
  handleEditCancel = (e) => {
    this.setState({
      editVisible: false,
    })
  }
  // 显示删除modal
  showDelModal = (record) => {
    // 返回数据给后台
    // 删除成功显示按钮
    this.setState({
      delVisible: true,
      delDataLength: 0,
    })
  }
  // 删除所选
  delSelectData = () => {
    if (this.state.selectedRows.length < 1) {
      showNotificationWithIcon('必须选择至少一条数据')
    } else {
      let delSelectData = []
      delSelectData = this.state.selectedRows
      console.log('del')
      console.log(delSelectData)
      // 提交数据
      this.setState({
        delVisible: true,
        delDataLength: delSelectData.length,
      })
    }
  }
  delOk = () => {
    this.setState({
      delVisible: false,
    })
    // 刷新数据
  }
  delCancel = () => {
    this.setState({
      delVisible: false,
    })
  }
  testData = () => {
    // ajax request after empty completing
    setTimeout(() => {
      for (let i = 0; i < 46; i++) {
        data.push({
          key: i,
          bank: ['北京银行', '中国银行', '农业银行', '交通银行'][Math.ceil(Math.random() * 4) - 1],
          customer: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          linkFrom: ['项目', '百一测评'][Math.ceil(Math.random() * 2) - 1],
          bankAccount: Math.random() * 1000,
          receiptMethod: ['test1', 'test2'][Math.ceil(Math.random() * 2) - 1],
        })
      }
      this.setState({
        loading: false,
      })
    }, 1000)
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '操作按钮',
      dataIndex: 'operateBtn',
      key: '1',
      width: 100,
      render: (text, record, index) => (
        <div>
          <Button onClick={this.showEditModal.bind(this, record)}>编辑</Button>&nbsp;&nbsp;
          <Button onClick={this.showDelModal.bind(this, record)}>删除</Button>
        </div>
      ),
    }, {
      title: '客户名称',
      dataIndex: 'customer',
      key: '2',
      width: 100,
    }, {
      title: '银行名称',
      dataIndex: 'bank',
      key: '3',
      width: 100,
    }, {
      title: '银行帐号',
      dataIndex: 'custBankAccount',
      key: '4',
      width: 100,
    }, {
      title: '收款方法',
      dataIndex: 'receiptMethod',
      key: '5',
      width: 100,
    }, {
      title: '关系来源',
      dataIndex: 'linkFrom',
      key: '6',
      width: 100,
    },
    ]
    const rowSelection = {
      type: 'checkBox',
      onSelect: (record, selected, selectedRows) => {
        this.setState({
          selectedRows: selectedRows,
        })
      },
    }
    return (<div>
      <CustomerBankLinkWithForm />
      <br />
      <Button onClick={this.showAutoAdd}>人工添加</Button>&nbsp;&nbsp;
      <Button onClick={this.delSelectData}>删除</Button>
      <br /><br />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        size="middle"
        bordered
        pagination="true"
        scroll={{y: true}}
      />
      { /* 编辑客户银行关系modal */ }
      {/*  */}
      <Modal
        title={this.state.edittitle}
        visible={this.state.editVisible}
        onCancel={this.handleEditCancel}
        onOk={this.state.edittitle === '编辑客户银行关系数据' ? this.handleEditOk : this.handleAutoAddOk}
      >
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={12} key={1}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('customer')(<SelectCustomerWithForm />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={12} key={2}>
              <FormItem {...formItemLayout} label="银行名称">
                {getFieldDecorator('bank')(
                  <Input
                    placeholder="请输入银行名称"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12} key={3}>
              <FormItem {...formItemLayout} label="银行帐号">
                {getFieldDecorator('bankAccount')(
                  <Input
                    placeholder="请输入银行帐号"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={12} key={4}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('receiptMethod')(
                  <Input
                    placeholder="请输入收款方法"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12} key={5}>
              <FormItem {...formItemLayout} label="关系来源">
                {getFieldDecorator('linkFrom')(
                  <Input
                    placeholder="请输入关系来源"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
      { /* 删除数据modal */ }
      <Modal
        visible={this.state.delVisible}
        onOk={this.delOk}
        onCancel={this.delCancel}
        title="删除数据"
      >
        {this.state.delDataLength === 0 ? '失效当前数据成功' : '成功失效' + this.state.delDataLength + '条数据'}
      </Modal>
    </div>)
  }
}
CustomerBankLink.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const CustomerBankLinks = Form.create()(CustomerBankLink)
export default CustomerBankLinks
