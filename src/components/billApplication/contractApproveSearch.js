import React from 'react'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'
import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const confirm = Modal.confirm;
class ContractApproveSearch extends React.Component {
  state = {
    visible: false,
    pageNo: 1,
    pageSize: 10,
    total: 1,
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
    loading: false,
    firstLoad: true,
    inputValue: '',
  }

  componentWillMount() {
    if (this.props.initialValue) {
      this.props.onChange(this.props.initialValue)
    }
  }

  componentDidMount() {
    if (this.props.defaultQueryParam || !this.props.showSearch) {
      this.handleQuery()
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
    const selectedRow = this.state.selectedRows[0]
    const _this = this
    if(selectedRow.isContracted === 'Y') {
      confirm({
        title: '提示',
        content: '已大签合同审批表，是否继续继续选择?',
        onOk() {
          _this.props.onChange(selectedRow)
          _this.handleCancel()
        },
      });
    }

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

  handleQueryFetch= () => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        const param = {
          method: 'GET',
        }
        this.setState({
          loading: true
        })
        requestJsonFetch(`${this.props.url}/${values.keywords}`, param, this.handleCallback)
      }
    })
  }


  handleCallback = (response) => {
    const { resultCode, resultMessage, contractForecastInfoList } = response
    if (resultCode === '000000') {
      this.setState({
        dataSource: contractForecastInfoList,
        firstLoad: false,
        loading: false,
      })
    }
  }

  handleEmitEmpty = () => {
    this.props.onChange('')
  }

  render() {
    const { visible, selectedRowKeys } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const suffix = this.props.value ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={() => this.setState({ visible: true })} />
    return (
      <div>
        <Input
          style={{zIndex: '0', width: '200px'}}
          placeholder={this.props.label}
          value={this.props.value && this.props.value[this.props.valueKey] ? this.props.value[this.props.valueKey] : this.state.inputValue}
          suffix={suffix}
          onClick={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择"
          width={this.props.width ? this.props.width : '600px'}
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
          {
            this.props.showSearch ?
              <Form
                className="ant-search-form"
              >
                <div style={{padding: '10px 0'}}>
                  <Row>
                    <Col span={16} key={1}>
                      <FormItem {...formItemLayout} label={this.props.label}>
                        {getFieldDecorator('keywords', {
                          initialValue: this.props.defaultQueryParam,
                          rules: [{ required: true, message: '请输入合同审批流水号进行查询!' }]
                        })(
                          <Input
                            onPressEnter={this.handleQuery}
                            placeholder="请输入合同审批流水号"
                          />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={1} key={2} />
                    <Col span={7} key={3}>
                      <Button type="primary" icon="search" htmlType="submit" onClick={this.handleQuery}>查询</Button>
                    </Col>
                  </Row>
                </div>
              </Form> : null
          }
          <Table
            columns={this.props.columns}
            rowSelection={rowSelection}
            bordered
            size="small"
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
            scroll={this.props.width ? {x: 900} : false}
          />
        </Modal>
      </div>
    )
  }
}

export default Form.create()(ContractApproveSearch)
