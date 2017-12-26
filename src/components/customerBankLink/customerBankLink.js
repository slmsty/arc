/**
 * Created by liangshuang on 17/10/20.
 */
/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal, Form, Row, Col, Input, message, Select, Icon } from 'antd'
import CustomerBankLinkWithForm from './customerBankLinkSearch'
import EditBankLinkData from './editBankLinkData'
import SelectCustomerWithForm from '../common/selectCustomer'


const data = []
const FormItem = Form.Item
const Option = Select.Option
class CustomerBankLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      delVisible: false,
      editVisible: false,
      selectedRow: [],
      edittitle: '',
      selectedRowsData: [],
      delDataLength: '',
      selectedRows: [],
      selectedRowKeys: [],
      tableHeight: '',
      editModalData: [],
    }
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin24-padding24-查询条件div168-按钮56-翻页160
    const tableHeight = screenHeight - 64 - 24 - 24 - 168 - 28 - 24 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.arcCustBankLink.receiptClaimListRefresh !== nextProps.arcCustBankLink.receiptClaimListRefresh) {
      this.handleQuery()
    }
  }
  // select change
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
    status: '1',
  }
  /*
   function handleQuery
   query data
   */
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    this.props.getArcCustBankList(this.queryParam).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          loading: false,
        })
      } else {
        message.error('加载数据失败')
        this.setState({
          loading: false,
        })
      }
    })
  }
  /*
   function handleChangeParam
   params: param Query Condition
   */
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery()
  }
  /*
   function handleChangeSize
   params:
   current: current pageNo
   size: current pageSize
   */
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.handleQuery()
  }
  /*
   function handleChangePage
   params:
   page: current page
   */
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  /*
   function showAutoAdd
   show add modal
   */
  showAutoAdd = () => {
    this.setState({
      editVisible: true,
      edittitle: '人工添加客户银行关系数据',
      editModalData: [],
    })
  }
  /*
   function showEditModal
   params:
   record : current data
   show edit modal
   */
  showEditModal = (record) => {
    this.setState({
      editVisible: true,
      edittitle: '编辑客户银行关系数据',
      editModalData: record,
    })
  }
  /*
   function submitAddData
   params: addData post data
   */
  submitAddData = (addData) => {
    this.setState({
      editVisible: false,
      editModalData: [],
    })
    this.props.addArcCustBankData(addData).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('添加数据成功')
      } else {
        message.error('添加数据失败')
      }
    })
  }
  /*
   function handleEditCancel
   cancel edit modal data
   */
  handleEditCancel = (e) => {
    this.setState({
      editVisible: false,
    })
  }
  /*
   function deleteDataFun
   params:
   delData : delete data
   length: data length
   type: 1-single delete  2-multi delete
   delete data
   */
  deleteDataFun = (delData, length, type) => {
    if (type === '2') {
      this.props.deleteArcCustBankDatas(delData).then((res) => {
        // console.log(res)
        if (res && res.response && res.response.resultCode === '000000') {
          message.success('成功失效' + length + '条数据')
        } else {
          message.error('删除数据失败')
        }
      })
    }
    if (type === '1') {
      this.props.deleteArcCustBankData(delData).then((res) => {
        // console.log(res)
        if (res && res.response && res.response.resultCode === '000000') {
          message.success('删除数据成功')
        } else {
          message.error('删除数据失败')
        }
      })
    }
  }
  /*
   function delOk
   confirm delete data and hidden del modal
   */
  delOk = () => {
    this.setState({
      delVisible: false,
    })
    const delLength = this.state.selectedRows.length
    const delData = this.state.selectedRows
    if (delLength === 0) {
      message.error('请选择删除数据 ')
      return
    }
    if (delLength >= 1) {
      const delSelectData = {}
      const bankCustIds = []
      delData.forEach((item, index) => {
        bankCustIds[index] = item.bankCustId
      })
      delSelectData.bankCustIds = bankCustIds
      this.deleteDataFun(delSelectData, delLength, '2')
    } else {
      this.deleteDataFun(delData.bankCustId, 1, '1')
    }
  }
  /*
   function showDelModal
   show del modal
   */
  showDelModal = (record) => {
    this.setState({
      delVisible: true,
      selectedRows: record,
    })
  }
  /*
   function showDelMultiModal
   show multi del modal
   */
  showDelMultiModal = () => {
    if (this.state.selectedRows.length < 1) {
      message.error('必须选择至少一条数据')
    } else {
      this.setState({
        delVisible: true,
      })
    }
  }
  /*
   function delCancel
   cancel delete data and hidden del modal
   */
  delCancel = () => {
    this.setState({
      delVisible: false,
    })
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '客户名称',
      dataIndex: 'erpCustName',
      width: 300,
    }, {
      title: '银行名称',
      dataIndex: 'custBankName',
      width: 300,
    }, {
      title: '银行帐号',
      dataIndex: 'custBankAccount',
      width: 200,
    }, {
      title: '关系来源',
      dataIndex: 'sourceType',
      width: 100,
    }, {
      title: '数据状态',
      dataIndex: 'status',
      width: 100,
    }, {
      title: '操作',
      dataIndex: 'operateBtn',
      textAlign: 'center',
      width: 60,
      fixed: 'right',
      render: (text, record, index) => (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          <Icon type="edit" onClick={() => this.showEditModal(record)} />&nbsp;&nbsp;&nbsp;&nbsp;
          <Icon type="delete" onClick={() => this.showDelModal(record)} />
        </div>
      ),
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
    tableData.forEach((item, index) => {
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
      <Button onClick={this.showDelMultiModal}>删除</Button>
      <br /><br />
      <Table
        rowKey="bankCustId"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        size="small"
        loading={this.state.loading}
        bordered
        pagination={pagination}
        scroll={{ x: '1600px', y: this.state.tableHeight }}
      />
      { /* 编辑客户银行关系modal */ }
      {this.state.editVisible ? <EditBankLinkData
        title={this.state.edittitle}
        visible={this.state.editVisible}
        onCancel={this.handleEditCancel}
        queryParams={this.submitAddData}
        editModalData={this.state.editModalData}
        onOk={this.state.edittitle === '编辑客户银行关系数据' ? this.handleEditOk : this.handleAutoAddOk}
      /> : null}
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
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
  arcCustBankLink: PropTypes.shape({
    getBankLinkList: PropTypes.arrayOf.isRequired,
    result: PropTypes.arrayOf.isRequired,
    receiptClaimListRefresh: PropTypes.number.isRequired,
  }).isRequired,
}
const CustomerBankLinks = Form.create()(CustomerBankLink)
export default CustomerBankLinks
