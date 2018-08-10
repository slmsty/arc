import React from 'react'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message, Select } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class ApproveSearch extends React.Component {
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
      keywords: '',
    }
    this.currentText = ''
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const personIds = this.props.value
    const selected = selectedRows[selectedRows.length - 1]
    if(personIds.length > 0 && selectedRows.length > 0 && personIds.includes(`${selected.staffName}(${selected.personId})`)) {
      message.warning('审批人已存在，请重新选择!')
      return false
    }
    this.setState({ selectedRowKeys, selectedRows })
  }

  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择记录')
      return
    }
    const selected = this.state.selectedRows.map(s => `${s.staffName}(${s.personId})`).concat(this.props.value)
    this.props.onChange(selected)
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
        keywords: this.state.keywords,
      },
    }
    this.setState({
      loading: true
    })
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
    } else {
      message.error(response.resultMessage)
      this.setState({
        loading: false,
      })
    }
  }

  handleEmitEmpty = () => {
    this.props.onChange([])
  }

  handleChange = (v) => {
    this.textTemp = ''
    this.props.onChange(v)
  }

  handleBlur= () => {
    /*let values = this.props.value || []
    if(this.currentText) {
      values.push(this.currentText)
      this.props.onChange(values)
    }*/
    let values = this.props.value || []
    this.props.onChange(values)
    this.currentText = ''

  }

  handleSearch = (v) => {
    this.setState({visible: true})
    //this.currentText = v
  }

  render() {
    const { visible } = this.state
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
          value={this.props.value}
          placeholder={this.props.placeholder}
          dropdownStyle={{ display: 'none' }}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          onBlur={this.handleBlur}
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
          <div style={{margin: '20px 0', padding: '0 40px'}}>
            <Row>
              <Col span={16} key={1}>
                员工姓名:
                <Input
                  style={{width: '300px', margin: '0 10px'}}
                  ref={el => this.inputElement = el}
                  onPressEnter={this.handleQuery}
                  placeholder="请输入关键字"
                  onChange={(e) => this.setState({
                    keywords: e.target.value
                  })}
                />,
              </Col>
              <Col span={1} key={2} > </Col>
              <Col span={7} key={3}>
                <Button type="primary" icon="search" htmlType="submit" onClick={this.handleQuery}>查询</Button>
              </Col>
            </Row>
          </div>
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

export default ApproveSearch
