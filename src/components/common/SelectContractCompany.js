import React, {Component} from 'react'
import {Input, Modal, Button, Form, Table, message} from 'antd';
const Search = Input.Search;
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
      visible: false,
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
  }

  onSelectChange = (selectedRowKeys, selectedRows)=>{
    this.setState({selectedRowKeys, selectedRows})
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const columns = this.columns;
    const pageInfo = this.state.pageInfo;

    return (
      <div className="SelectContractCompany">
        <Search 
          placeholder="签约公司" 
          value={this.state.name}
          onSearch={this.openModel}
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
