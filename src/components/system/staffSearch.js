import React from 'react'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message, Select } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class StaffSearch extends React.Component {
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
      selectEmail: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.value.length === 0 && this.props.value !== nextProps.value) {
      this.setState({
        selectEmail: nextProps.value
      })
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择记录')
      return
    }
    const selectedEmail = this.state.selectedRows.map(s => s.email).concat(this.state.selectEmail)
    this.setState({selectEmail: selectedEmail})
    this.props.onChange(selectedEmail)
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
    if(typeof keywords === 'undefined') {
      message.warn('请输入关键字查询')
      return
    }
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageNo || 1,
          pageSize: this.state.pageSize,
        },
        keywords,
        billingApplicationType: this.props.billType,
      },
    }
    requestJsonFetch(this.props.url, param, this.handleCallback)
  }

  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.count,
        dataSource: response.pageInfo.result,
        firstLoad: false,
        loading: false,
      })
    }
  }

  handleEmitEmpty = () => {
    this.props.onChange('')
  }

  handleChange = (v) => {
    this.setState({
      selectEmail: v,
    })
    this.props.onChange(v)
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
      type: 'checkbox',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <Select
          mode="tags"
          style={{width: '500px'}}
          value={this.state.selectEmail}
          placeholder={this.props.placeholder}
          dropdownStyle={{ display: 'none' }}
          onChange={this.handleChange}
        />
        <Icon
          type="search"
          style={{ fontSize: 16, marginLeft: '5px', cursor: 'pointer' }}
          onClick={() => this.setState({visible: true})}
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
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="员工姓名">
                  {getFieldDecorator('keywords', {
                    initialValue: this.props.defaultQueryParam,
                  })(
                    <Input
                      onPressEnter={this.handleQuery}
                      placeholder="请输入关键字"
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
            columns={this.props.columns}
            rowSelection={rowSelection}
            rowKey="accountId"
            bordered
            size="middle"
            dataSource={this.state.dataSource}
            loading={this.state.loading}
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

export default Form.create()(StaffSearch)
