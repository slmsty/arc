import React, {Component} from 'react'
import {Input, Modal, Button, Form, Table, Icon, message} from 'antd';
const FormItem = Form.Item;

class SelectContractCompany extends Component{
  constructor(props){
    super(props)
    const columns = [
      {
        title: '公司名称',
        key: 'name',
      },
      {
        title: '公司编码',
        key: 'code',
      },
      {
        title: '所属BG',
        key: 'bg',
      },
    ]
    this.columns = columns.map(o=>({
      ...o,
      dataIndex: o.key,
      width: 100,
    }))

    this.state = {
      name: '',
      loading: false,
      ready: false,
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
      pageInfo: {
        pageNo: 1,
        pageSize: 5,
        count: 0,
        result: []
      }
    }
  }

  openModel = (value)=>{
    this.setState({
      visible: true
    })
  }

  clearName = ()=>{
    this.setState({
      name: ''
    })
  }

  OK = ()=>{
    if (this.state.selectedRows.length === 0) {
      message.error('请选择认款公司')
      return
    }
    let {name, code} = this.state.selectedRows[0];
    this.props.onChange(code);
    this.setState({
      name,
      visible: false,
      loading: false,
      ready: false,
      selectedRowKeys:[],
      selectedRows: [],
      pageInfo: {
        pageNo: 1,
        pageSize: 5,
        count: 0,
        result: []
      }
    })
    this.props.form.resetFields();
  }

  Cancel = ()=>{
    this.setState({
      name: '',
      visible: false,
      loading: false,
      ready: false,
      selectedRowKeys:[],
      selectedRows: [],
      pageInfo: {
        pageNo: 1,
        pageSize: 5,
        count: 0,
        result: []
      }
    })
    this.props.form.resetFields();
  }

  doSearch = (e)=>{
    e.preventDefault()
    this.setState({
      loading: true
    })
    setTimeout(()=>{
      this.setState({
        ready: true,
        loading: false,
        selectedRowKeys:[],
        selectedRows: [],
        pageInfo: {
          pageNo: 1,
          pageSize: 5,
          count: 100,
          result: [
            {
              key:1,
              name:'公司一号',
              code:'1',
              bg:'1',
            },
            {
              key:2,
              name:'公司二号',
              code:'2',
              bg:'2',
            },
          ]
        }
      })
    }, 500);
  }

  onSelectChange = (selectedRowKeys, selectedRows)=>{
    this.setState({selectedRowKeys, selectedRows})
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const columns = this.columns;
    const pageInfo = this.state.pageInfo;
    const suffix = this.state.name ? <Icon type="close-circle" onClick={this.clearName} /> : <Icon type="search" onClick={this.openModel} />;

    return (
      <div className="SelectContractCompany">
        <Input 
          placeholder="签约公司" 
          value={this.state.name}
          suffix={suffix}
          onClick={this.openModel}/>
        <Modal
          title="认款公司查询"
          visible={this.state.visible}
          onCancel={this.Cancel}
          onOk={this.OK}>
          <Form layout="inline" onSubmit={this.doSearch}>
            <FormItem label="认款公司">
              {
                getFieldDecorator('keywords')(
                  <Input placeholder="请输入关键字" />
                )
              }
            </FormItem>
            <FormItem>
              <Button type="primary" icon="search" htmlType="submit">查询</Button>
            </FormItem>
          </Form>
          <br/>
          <Table 
            rowSelection={{
              type:'radio', 
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: this.onSelectChange}}
            bordered
            loading={this.state.loading}
            locale={{emptyText: this.state.ready ? '没有符合条件的认款公司' : ''}}
            columns={columns} 
            dataSource={pageInfo.result}
            pagination={{
              simple: true,
              pageSize: pageInfo.pageSize,
              onChange: ()=>{},
            }}></Table>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(SelectContractCompany)
