/**
 * Created by liangshuang on 17/12/12.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class ProductLine extends React.Component {
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
    inputValue: '',
    selectValue:'',
    flag: true,
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
    this.setState({
      selectedRowKeys,
      selectedRows,
    })
  }
  columns = [{
    title: '产品线编码',
    dataIndex: 'proNo',
    width: 200,
  }, {
    title: '产品线名称',
    dataIndex: 'proName',
    width: 200,
  },
  ]
  handleOk = () => {
    const {indexs, columns} = this.props
    console.log(this.state.selectedRows)
    if (this.state.selectedRows.length === 0) {
      message.error('请选择产品线')
      return
    }
    this.props.onChange({
      No: this.state.selectedRows[0].proNo,
      Name: this.state.selectedRows[0].proName,
      indexs: indexs,
      columns: columns,
    })
    this.setState({
      inputValue: this.state.selectedRows[0].proName,
      flag: true,
    })
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
    requestJsonFetch('/arc/common/prd/list', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.pageCount,
        customerList: response.pageInfo.result,
        firstLoad: false,
      })
    }
    this.setState({ loading: false })
  }
  handleEmitEmpty = () => {
    this.props.onChange({
      No: '',
      Name: '',
      indexs: '',
      columns: '',
    })
    this.setState({
      inputValue: '',
    })
    this.props.onCancel()
  }
  showValue = () => {
    const text = this.props.text
    let value = ''
    if(typeof text ==='string'){
      value = text
    }else if(text.length > 0){
      value = text[1]
    }
    return value
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
    const suffix = (this.state.inputValue) ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={() => this.setState({ visible: true })} />
    return (
      <div>
        <Input
          style={{zIndex:'0'}}
          placeholder="产品线"
          value={this.state.flag && this.props.text ? this.showValue() :(this.props.value && this.props.value[1] ? this.props.value[1] : (this.props.valueName ? this.props.valueName : '' ))}

          // value={this.state.selectValue ? this.state.selectValue : (this.props.initialValue ? this.props.initialValue : '请选择')}
          suffix={suffix}
          onClick={() => this.setState({ visible: true })}
          disabled={this.props.disabled}
        />
        <Modal
          title="产品线查询"
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
                <FormItem {...formItemLayout} label="产品线">
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
            rowKey="sbuNo"
            columns={this.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.customerList}
            loading={this.state.loading}
            locale={{
              emptyText: this.state.firstLoad ? '' : '没有符合条件的产品线',
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

ProductLine.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  defaultQueryParam: PropTypes.string,
}

export default Form.create()(ProductLine)
