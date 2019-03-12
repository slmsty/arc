import React from 'react'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item

class SelectSearch extends React.Component {
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
    this.props.onChange(selectedRow)
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
    const keywords = this.props.form.getFieldValue('keywords')
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageNo || 1,
          pageSize: this.state.pageSize,
        },
          companyId:this.props.cId&&this.props.cId!=='-1'?Number(this.props.cId):'',
        keywords,
        billingApplicationType: this.props.billType,
      },
    }
    this.setState({
      loading: true
    })
    requestJsonFetch(this.props.url, param, this.handleCallback)
  }


  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      let result = response.pageInfo.result
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.count,
        dataSource: result,
        firstLoad: false,
        loading: false,
      })
    }
  }

  handleEmitEmpty = () => {
    this.props.onChange('')
  }
visible=()=>{
  
  

      if(this.props.cId===''){
      message.error('请先填写签约公司');
 
      return
            }


 
this.setState({ visible: true })

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
    const suffix = this.props.value ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={this.visible} />
    return (
      <div>
        <Input
          style={{zIndex: '0', width: '200px'}}
          placeholder={this.props.label}
          value={this.props.value && this.props.value[this.props.valueKey] ? this.props.value[this.props.valueKey] : this.state.inputValue}
          suffix={!this.props.disabled ? suffix : null}
          onClick={this.visible}
          disabled={this.props.disabled}
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
                <Row>
                  <Col span={16} key={1}>
                    <FormItem {...formItemLayout} label={this.props.label}>
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
            scroll={this.props.width ? {x: 900} : {}}
          />
        </Modal>
      </div>
    )
  }
}

export default Form.create()(SelectSearch)
