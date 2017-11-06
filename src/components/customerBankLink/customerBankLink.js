/**
 * Created by liangshuang on 17/10/20.
 */
/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal, Form, Row, Col, Input, notification, message, Spin } from 'antd'
import CustomerBankLinkWithForm from './customerBankLinkSearch'
import EditBankLinkData from './editBankLinkData'
import SelectCustomerWithForm from '../common/selectCustomer'
import SelectCustomerWithFormForBankLink from '../common/selectCustomerForBankLink'


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
      currentPage: 1,
      currentpageSize: 10,
      loading: false,
      delVisible: false,
      editVisible: false,
      selectedRow: [],
      edittitle: '',
      selectedRowsData: [],
      delDataLength: '',
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    // this.testDatas()
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    erpCustId: '',
    receiptMethodId: '',
    payBankAccount: '',
    status: '',
  }
  handleQuery = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    this.props.getArcCustBankList(this.queryParam)
  }
  // 查询接口
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery()
  }
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.handleQuery()
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  // 显示人工添加modal
  showAutoAdd = () => {
    this.setState({
      editVisible: true,
      edittitle: '人工添加客户银行关系数据',
    })
    // 重新清空数据
    this.props.form.resetFields()
  }
  // 确认人工添加数据
  handleAutoAddOk = () => {
    this.setState({
      editVisible: false,
    })
    const addData = this.props.form.getFieldsValue() // 获取modal数据
    const custId = this.props.form.getFieldValue('erpCustId')
    // 处理数据
    delete addData.erpCustId
    addData.erpCustId = custId[0]
    addData.erpCustName = custId[1]
    const postAddData = {}
    postAddData.arcBankCust = addData
    // console.log(postAddData)
    // 提交数据
    const testData = {
      arcBankCust: {
        custBankName: '招商银行',
        custBankAccount: '62220282726',
        erpCustName: '辽宁联通',
        erpCustId: '2341',
        sourceType: 'CBS',
        receiptClaimId: '7641',
      },
    }
    this.props.addArcCustBankData(postAddData).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('添加数据成功')
      } else {
        message.error('添加数据失败')
      }
    })
    this.handleQuery()
  }
  // 显示编辑客户银行关系modal
  showEditModal = (record) => {
    this.setState({
      editVisible: true,
      edittitle: '编辑客户银行关系数据',
    })
    // 赋值给modal
    console.log(record)
    this.props.form.setFieldsValue(record)
  }
  // 提交编辑客户银行关系数据 关闭modal
  handleEditOk = (record) => {
    this.setState({
      editVisible: false,
    })
    const newEditData = this.props.form.getFieldsValue()
    // console.log('get', newEditData)
    const postEditData = {}
    postEditData.arcBankCust = newEditData
    // console.log('post', postEditData)
    // 提交给后台接口
    this.props.addArcCustBankData(postEditData).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('添加数据成功')
      } else {
        message.error('添加数据失败')
      }
    })
    this.handleQuery()
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
      selectedRows: record,
    })
  }
  // 删除所选
  delSelectData = () => {
    if (this.state.selectedRows.length < 1) {
      showNotificationWithIcon('必须选择至少一条数据')
    } else {
      // 提交数据
      this.setState({
        delVisible: true,
      })
    }
  }
  // 删除单条
  delOneData = () => {
    const delDatas = this.state.selectedRows
    // console.log(delDatas)
    this.props.deleteArcCustBankData(delDatas.bankCustId).then((res) => {
      // console.log(res)
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('删除数据成功')
      } else {
        message.error('删除数据失败')
      }
    })
  }
  delOk = () => {
    this.setState({
      delVisible: false,
    })
    const delLength = this.state.selectedRows.length
    if (delLength >= 1) {
      // console.log(delLength)
      const delSelectData = {}
      const bankCustIds = []
      this.state.selectedRows.map((item, index) => {
        bankCustIds[index] = item.bankCustId
      })
      delSelectData.bankCustIds = bankCustIds
      // console.log('deletes', delSelectData)
      this.props.deleteArcCustBankDatas(delSelectData).then((res) => {
        console.log(res)
        if (res && res.response && res.response.resultCode === '000000') {
          message.success('成功失效' + delLength + '条数据')
        } else {
          message.error('删除数据失败')
        }
      })
    } else {
      this.delOneData()
    }
    this.handleQuery()
    // 刷新数据
  }
  delCancel = () => {
    this.setState({
      delVisible: false,
    })
  }
  testDatas = () => {
    // ajax request after empty completing
    setTimeout(() => {
      for (let i = 0; i < 46; i++) {
        data.push({
          key: i,
          custBankName: ['北京银行', '中国银行', '农业银行', '交通银行'][Math.ceil(Math.random() * 4) - 1],
          erpCustName: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          sourceType: ['项目', '百一测评'][Math.ceil(Math.random() * 2) - 1],
          custBankAccount: Math.random() * 1000,
          receiptClaimId: ['test1', 'test2'][Math.ceil(Math.random() * 2) - 1],
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
          <Button onClick={this.showEditModal.bind(this, record)}>编辑</Button>&nbsp;
          <Button onClick={this.showDelModal.bind(this, record)}>删除</Button>
        </div>
      ),
    }, {
      title: '客户名称',
      dataIndex: 'erpCustName',
      key: '2',
      width: 100,
    }, {
      title: '银行名称',
      dataIndex: 'custBankName',
      key: '3',
      width: 100,
    }, {
      title: '银行帐号',
      dataIndex: 'custBankAccount',
      key: '4',
      width: 100,
    }, {
      title: '关系来源',
      dataIndex: 'sourceType',
      key: '6',
      width: 100,
    }, {
      title: '数据状态',
      dataIndex: 'status',
      width: 100,
    },
    ]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    const pagination = {
      current: this.props.arcCustBankLink.getBankLinkList.pageNo,
      total: this.props.arcCustBankLink.getBankLinkList.count,
      pageSize: this.props.arcCustBankLink.getBankLinkList.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    // 转换数据
    const tableData = this.props.arcCustBankLink.getBankLinkList.result
    tableData.map((item, index) => {
      if (item.status === '1') {
        item.status = '有效'
      }
      if (item.status === '0') {
        item.status = '无效'
      }
    })
    return (<div>
      <CustomerBankLinkWithForm
        onQuery={this.handleChangeParam}
      />
      <br />
      <Button onClick={this.showAutoAdd}>人工添加</Button>&nbsp;&nbsp;
      <Button onClick={this.delSelectData}>删除</Button>
      <br /><br />
      <Table
        rowKey="bankCustId"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.props.arcCustBankLink.getBankLinkList.result}
        size="middle"
        bordered
        className="mytable"
        pagination={pagination}
        scroll={{ y: true }}
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
                {getFieldDecorator('erpCustId', {
                  initialValue: ['111', 'adsfd'],
                })(<SelectCustomerWithForm />)}
              </FormItem>
            </Col>
            <Col span={12} key={2}>
              <FormItem {...formItemLayout} label="银行名称">
                {getFieldDecorator('custBankName')(
                  <Input
                    placeholder="请输入银行名称"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={12} key={3}>
              <FormItem {...formItemLayout} label="银行帐号">
                {getFieldDecorator('custBankAccount', {
                  rules: [{ pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确银行帐号' }],
                })(
                  <Input
                    placeholder="请输入银行帐号"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12} key={5}>
              <FormItem {...formItemLayout} label="关系来源">
                {getFieldDecorator('sourceType')(
                  <Input
                    placeholder="请输入关系来源"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          {getFieldDecorator('bankCustId')(
            <Input
              type="hidden"
            />,
          )}
        </Form>
      </Modal>
      { /* 删除数据modal */ }
      <Modal
        visible={this.state.delVisible}
        onOk={this.delOk}
        onCancel={this.delCancel}
        title="删除数据"
      >
        确定失效当前数据？
      </Modal>
    </div>)
  }
}
CustomerBankLink.propTypes = {
  getArcCustBankList: PropTypes.func.isRequired,
  addArcCustBankData: PropTypes.func.isRequired,
  deleteArcCustBankData: PropTypes.func.isRequired,
  deleteArcCustBankDatas: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  arcCustBankLink: PropTypes.shape({
    getBankLinkList: PropTypes.arrayOf.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
}
const CustomerBankLinks = Form.create()(CustomerBankLink)
export default CustomerBankLinks
