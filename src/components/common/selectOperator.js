/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class SelectOperator extends React.Component {
  state = {
    visible: false,
    pageNo: 1,
    pageSize: 1000,
    total: 1,
    customerList: [],
    selectedRowKeys: [],
    selectedRows: [],
    loading: false,
    firstLoad: true,
  }
  componentWillMount() {
    if (this.props.initialValue) {
      this.props.onChange(this.props.initialValue)
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRows',selectedRows)
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '拆分操作人',
    dataIndex: 'accountName',
    width: 200,
  }, {
    title: '拆分操作人编号',
    dataIndex: 'accountId',
    width: 200,
  },
  ]
  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择拆分操作人')
      return
    }
    this.props.onChange([this.state.selectedRows[0].accountId, this.state.selectedRows[0].accountName])
    /*this.props.onChange([this.state.selectedRows[0].customerId, this.state.selectedRows[0].customerName])
    this.setState({
      visible: false,
    })*/
    this.handleCancel()
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
      inputValue: '',
    })
  }
  handleChangePage = (page) => {
    this.handleQueryFetch(page)
  }
  handleQuery = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    this.handleQueryFetch(1)
  }
  handleQueryFetch= (pageNo) => {
    const param = {
      method: 'get',
    }
    this.setState({ loading: true })
    requestJsonFetch('/arc/contract/split/operator', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      console.log('22',response.result)
      this.setState({
        customerList: response.result,
        firstLoad: false,
      })
    }
    this.setState({ loading: false })
  }
  handleEmitEmpty = () => {
    this.props.onChange(['', ''])
  }
  handleSearch = () => {
    this.setState({ visible: true })
    this.handleQuery()
  }
  handleChange = (event) => {
    let getValue = event.target.value
    this.setState({
      inputValue: getValue,
    })
    this.props.onChange([getValue, getValue])
    // this.handleEmitEmpty()
  }
  render() {
    const { visible } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const suffix = (this.props.value && this.props.value[1]) ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={this.handleSearch} />
    return (
      <div>
        <Input
          placeholder="拆分操作人"
          onChange={this.handleChange}
          value={this.props.value && this.props.value[1] !== '' ? this.props.value[1] : this.state.inputValue}
          suffix={suffix}
        />
        <Modal
          title="选择拆分操作人"
          style={{ top: 20 }}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />选择拆分操作人
            </Button>,
          ]}
        >

          <Table
            scroll={{y:300}}
            rowKey="customerId"
            columns={this.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.customerList}
            loading={this.state.loading}
            locale={{
              emptyText: this.state.firstLoad ? '' : '没有符合条件的拆分操作人',
            }}
            pagination={false}
            /*pagination={{
              current: this.state.pageNo,
              onChange: this.handleChangePage,
              total: this.state.total,
              size: 'small',
            }}*/
          />
        </Modal>
      </div>
    )
  }
}

SelectOperator.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  defaultQueryParam: PropTypes.string,
}

const SelectOperatorWithForm = Form.create()(SelectOperator)

export default SelectOperatorWithForm
