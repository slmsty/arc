import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class SelectSbu extends React.Component {
  state = {
    visible: false,
    pageNo: 1,
    pageSize: 8,
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
  componentDidMount() {
    if (this.props.defaultQueryParam) {
      this.handleQuery()
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: 'SBU编码',
    dataIndex: 'sbuNo',
    width: 200,
  }, {
    title: 'SBU名称',
    dataIndex: 'sbuName',
    width: 200,
  },
  ]
  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择SBU')
      return
    }
    this.props.onChange([this.state.selectedRows[0].sbuNo, this.state.selectedRows[0].sbuName])
    this.handleCancel()
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
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
    const keywords = this.props.form.getFieldValue('keywords')
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageNo || 1,
          pageSize: this.state.pageSize,
        },
        keywords,
      },
    }
    this.setState({ loading: true })
    requestJsonFetch('/arc/common/sbu_name/list', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.count,
        customerList: response.pageInfo.result,
        firstLoad: false,
      })
    }
    this.setState({ loading: false })
  }
  handleEmitEmpty = () => {
    this.props.onChange(['', ''])
  }
  render() {
    const { visible } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const pagination = {
      current: this.state.pageNo,
      onChange: this.handleChangePage,
      total: this.state.total,
      size: 'small',
    }
    const suffix = (this.props.value && this.props.value[1]) ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={() => this.setState({ visible: true })} />
    return (
      <div>
        <Input
          placeholder="SBU"
          value={this.props.keyName==='contract' && this.props.value && this.props.value[0] !== undefined ? (this.props.value[1]!== undefined ? `${this.props.value[0]}:${this.props.value[1]}` :this.props.value[0]) : (this.props.value && this.props.value[1] !== undefined ? this.props.value[1] : '')}
          suffix={suffix}
          onClick={() => this.setState({ visible: true })}
          disabled={this.props.disabled}
        />
        <Modal
          title="SBU查询"
          style={{ top: 20 }}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />确认
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="SBU">
                  {getFieldDecorator('keywords', {
                    initialValue: this.props.defaultQueryParam,
                  })(
                    <Input
                      onPressEnter={this.handleQuery}
                      placeholder="请输入SBU关键字"

                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={1} key={2} />
              <Col span={7} key={3}>
                <Button type="primary" icon="search" htmlType="submit" onClick={this.handleQuery}>查询</Button>
              </Col>
            </Row>
          </Form>

          <Table
            columns={this.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.customerList}
            loading={this.state.loading}
            locale={{
              emptyText: this.state.firstLoad ? '' : '没有符合条件的SBU',
            }}
            pagination={pagination}
          />
        </Modal>
      </div>
    )
  }
}

SelectSbu.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  defaultQueryParam: PropTypes.string,
}

export default Form.create()(SelectSbu)
