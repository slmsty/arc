import React from 'react'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class SelectInvoice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      pageNo: 1,
      pageSize: 10,
      total: 1,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      firstLoad: true,
    }
    this.selectColumns = [{
      title: '发票号',
      dataIndex: 'invoiceNumber',
      width: 100,
    }, {
      title: '关联金额',
      dataIndex: 'billingAmount',
      width: 100,
    }, {
      title: '关联人姓名',
      dataIndex: 'relatedPersonName',
      width: 100,
    }, {
      title: '关联时间',
      dataIndex: 'relatedTime',
      width: 100,
    }]
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

  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择的记录')
      return
    }
    const selectedRow = this.state.selectedRows[0]
    this.props.onChange([selectedRow[this.props.idKey], selectedRow[this.props.valueKey]])
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
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageNo || 1,
          pageSize: this.state.pageSize,
        },
        keywords: this.props.form.getFieldValue('keywords'),
        amountStart: this.props.form.getFieldValue('amountStart'),
        amountEnd: this.props.form.getFieldValue('amountEnd'),
        billingApplicationType: this.props.billType,
      },
    }
    this.setState({ loading: true })
    requestJsonFetch(this.props.url, param, this.handleCallback)
  }

  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.count,
        dataSource: response.pageInfo.result,
        firstLoad: false,
      })
    }
    this.setState({ loading: false })
  }

  handleEmitEmpty = () => {
    this.props.onChange('')
  }

  render() {
    const { visible } = this.state
    const formItemLayout1 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    }
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const suffix = (this.props.value && this.props.value[1] !== undefined) ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={() => this.setState({ visible: true })} />
    return (
      <div>
        <Input
          style={{zIndex: '0'}}
          placeholder={this.props.label}
          value={this.props.value && this.props.value[1] !== undefined ? this.props.value[1] : ''}
          suffix={suffix}
          onClick={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择"
          width={this.props.width ? this.props.width : '600px'}
          style={{ top: 20}}
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
            <div>
              <h3 style={{padding: '10px 0'}}>已关联的发票</h3>
              <Table
                rowKey="billingAppLineId"
                columns={this.selectColumns}
                rowSelection={false}
                bordered
                size="small"
                dataSource={[]}
                pagination={false}
              />
            </div>
            <Row>
              <Col span={8} key={1}>
                <FormItem {...formItemLayout1} label={this.props.label}>
                  {getFieldDecorator('keywords', {
                    initialValue: this.props.defaultQueryParam,
                  })(
                    <Input
                      width="100"
                      onPressEnter={this.handleQuery}
                      placeholder="请输入关键字"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={10} key={2} >
                <FormItem {...formItemLayout1} label="开票金额">
                  {getFieldDecorator('amountStart', {
                    initialValue: this.props.defaultQueryParam,
                  })(
                    <Input style={{width: '60px'}}/>,
                  )} ~
                  {getFieldDecorator('amountEnd', {
                    initialValue: this.props.defaultQueryParam,
                  })(
                    <Input style={{width: '60px'}}/>,
                  )}
                </FormItem>
              </Col>
              <Col span={2} key={3}>
                <Button type="primary" icon="search" htmlType="submit" onClick={this.handleQuery}>查询</Button>
              </Col>
            </Row>
          </Form>

          <Table
            rowKey={this.props.idKey}
            columns={this.props.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.dataSource}
            loading={this.state.loading}
            locale={{
              emptyText: this.state.firstLoad ? '' : '没有符合条件的记录',
            }}
            pagination={{
              current: this.state.pageNo,
              onChange: this.handleChangePage,
              total: this.state.total,
              size: 'small',
            }}
          />
        </Modal>
      </div>
    )
  }
}

export default Form.create()(SelectInvoice)
