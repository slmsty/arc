/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Table, Button, message, Icon } from 'antd'
import PropTypes from 'prop-types'
import ManualEntryBankTurnoverSearchWithForm from './manualEntryBankTurnoverSearch'
import EditManualEntryBankTurnoverDataWithForm from './editManualEntryBankTurnoverData'

export default class ManualEntryBankTurnover extends React.Component {
  state = {
    selectedRowKeys: [],
    editVisible: false,
    editKey: null,
  }
  componentDidMount() {
    this.handleQuery()
  }

  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
  handleEdit = (key) => {
    this.setState({ editKey: key, editVisible: true })
  }
  handleDelete = (key) => {
    console.log('delete:' + key)
  }
  handleQuery = () => {
  }
  handleExcept = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error('请选择想要排除的数据。')
    } else {
      console.log('调用排除接口，传递数据：[' + this.state.selectedRowKeys + ']，然后刷新列表')
      this.handleQuery()
    }
  }
  handleConfirm = () => {
    console.log('确认。。然后刷新数据。')
    this.handleQuery()
  }
  handleEditConfirm = () => {
    this.setState({ editVisible: false })
    this.handleQuery()
  }
  handleEditCancel = () => {
    this.setState({ editVisible: false })
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }

    return (
      <div>
        <ManualEntryBankTurnoverSearchWithForm
          query={this.handleQuery}
        />
        <Button type="default" onClick={() => { this.props.history.push('/batchImport') }}>批量导入</Button>&nbsp;&nbsp;
        <Button type="default" onClick={this.handleExcept}>排除</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={this.handleConfirm}>确认</Button>
        <br /><br />
        <Table
          rowSelection={rowSelection}
          columns={[{
            title: '数据状态',
            dataIndex: 'dataStatus',
            key: 'dataStatus',
            width: 80,
            fixed: 'left',
          }, {
            title: '收款日期',
            dataIndex: 'receiptDate',
            key: 'receiptDate',
            width: 90,
          }, {
            title: '收款方式',
            dataIndex: 'receiptMethod',
            key: 'receiptMethod',
            width: 100,
          }, {
            title: '银行流水号',
            dataIndex: 'bankTurnoverAcct',
            key: 'bankTurnoverAcct',
            width: 150,
          }, {
            title: '客户付款方式',
            dataIndex: 'custPayMethod',
            key: 'custPayMethod',
            width: 100,
          }, {
            title: '付款客户名称',
            dataIndex: 'payCustName',
            key: 'payCustName',
            width: 300,
          }, {
            title: '客户付款银行',
            dataIndex: 'custPayBank',
            key: 'custPayBank',
            width: 300,
          }, {
            title: '客户付款银行账号',
            dataIndex: 'custPayBankAcct',
            key: 'custPayBankAcct',
            width: 150,
          }, {
            title: '币种',
            dataIndex: 'currency',
            key: 'currency',
            width: 45,
          }, {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
          }, {
            title: '客户名称',
            dataIndex: 'custName',
            key: 'custName',
            width: 300,
          }, {
            title: '流水分类',
            dataIndex: 'turnoverType',
            key: 'turnoverType',
            width: 100,
          }, {
            title: '操作',
            dataIndex: 'ope',
            key: 'ope',
            width: 60,
            textAlign: 'center',
            fixed: 'right',
            render: (text, record) => {
              return (
                <div style={{ fontWeight: 'bold' }}>
                  <Icon type="edit" onClick={() => this.handleEdit(record.key)} />&nbsp;&nbsp;&nbsp;&nbsp;
                  <Icon type="delete" onClick={() => this.handleDelete(record.key)} />
                </div>
              )
            },
          }]}
          dataSource={[]}
          bordered
          size="middle"
          pagination="true"
          scroll={{ x: '1875px' }}
        />
        <EditManualEntryBankTurnoverDataWithForm
          width={800}
          onConfirm={this.handleEditConfirm}
          onCancel={this.handleEditCancel}
          editKey={this.state.editKey}
          visible={this.state.editVisible}
        />
      </div>
    )
  }
}

ManualEntryBankTurnover.propTypes = {
}
