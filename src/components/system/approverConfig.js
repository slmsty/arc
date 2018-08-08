import React from 'react'
import { Table, Button, Form, Row, Col, Input, Icon, message, Select, TreeSelect } from 'antd'
import ApproveConfigAdd from './approveConfigAdd'
import SelectSbu from '../common/SelectSbu'
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
}
class ApproverConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdd: false,
      record: {},
      action: '',
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  componentWillReceiveProps(nextPorps) {
    if(this.props.saveSuccess !== nextPorps.saveSuccess && nextPorps.saveSuccess) {
      message.success('审批人配置保存成功')
      this.setState({
        showAdd: false,
        record: {},
      })
      this.handleQuery()
    }
  }

  componentDidMount() {
    this.handleQuery()
    this.props.getApproveNodeList()
    this.props.queryRegionList({
      keywords: ''
    })
  }

  handleEdit = (record) => {
    this.setState({
      record,
      showAdd: true,
      action: 'Edit'
    })
  }

  getTableColumns = () => {
    const columns = [
      {
        title: '签约名称',
        dataIndex: 'signCompany',
        width: '17%',
      }, {
        title: '立项BU名称',
        dataIndex: 'projectBu',
        width: '17%',
      }, {
        title: '立项区域',
        dataIndex: 'projectRegion',
        width: '10%',
      }, {
        title: '审批角色',
        dataIndex: 'approveRole',
        width: '13%',
      }, {
        title: '审批角色对应人',
        dataIndex: 'approvePerson',
        width: '35%',
      }, {
        title: '操作',
        dataIndex: '',
        width: '5%',
        render: (text, record) => {
          return <a onClick={() => this.handleEdit(record)}>修改</a>
        }
      },
    ]
    return columns
  }

  handleQuery = (pageNo, pageSize) => {
    const value = this.props.form.getFieldsValue()
    const params = {
      ...value,
      sbuNo: value.sbuNo && value.sbuNo.length > 0 ? value.sbuNo[0] : '',
      pageInfo:{
        pageNo: pageNo || 1,
        pageSize: pageSize || 10
      },
    }
    this.props.queryApproverConfig(params)
  }

  render() {
    const { isLoading, approveConfigs, saveApprovePerson } = this.props
    const { pageNo, result, count} = approveConfigs
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys,
          record: selectedRows[0],
        })
      },
    }
    const pagination = {
      total: count,
      showTotal: (total) => (`共 ${total} 条`),
      current: pageNo,
      onChange: (current) => {
        this.handleQuery(current)
      },
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => {
        this.handleQuery(current, pageSize)
      },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={10}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="审批角色">
                {getFieldDecorator('nodeCode')(
                  <Select placeholder="请选择审批角色">
                    {
                      this.props.approveNodeList.map(node =>
                        <Option value={node.nodeCode}>{node.nodeName}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="审批人">
                {getFieldDecorator('person')(
                  <Input placeholder="模糊查询(姓名、员工号、NT账号)"/>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="立项BU">
                {getFieldDecorator('sbuNo')(
                  <SelectSbu />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="立项区域">
                {getFieldDecorator('region')(
                  <TreeSelect
                    disabled={this.isEdit}
                    value={this.state.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.props.regionList}
                    placeholder="请选择立项区域"
                    onChange={this.onChange}
                    showSearch={true}
                    treeNodeFilterProp='label'
                    treeDefaultExpandAll={true}
                    allowClear={true}
                    searchPlaceholder="根据区域名筛选"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="签约公司">
                {getFieldDecorator('company')(
                  <Input placeholder="模糊查询(公司ID或者公司名称)"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}></Col>
          </Row>
          <Row>
            <Col span={23} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
        <div style={{margin: '10px 0'}}>
          <Button type="primary" onClick={() => this.setState({showAdd: true, action: 'Add'})} ghost>新增</Button>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.setState({showAdd: true, action: 'Add'})} ghost>复制</Button>
        </div>
        <Table
          loading={isLoading}
          rowSelection={rowSelection}
          bordered
          size='middle'
          columns={this.getTableColumns()}
          dataSource={result}
          pagination={pagination}
        />
        {
          this.state.showAdd ?
            <ApproveConfigAdd
              visible={this.state.showAdd}
              onCancel={() => this.setState({showAdd: false, record: {}})}
              saveApprovePerson={saveApprovePerson}
              action={this.state.action}
              record={this.state.record}
              regionList={this.props.regionList}
              approveNodeList={this.props.approveNodeList}
            /> : null
        }
      </div>
    )
  }
}

export default Form.create() (ApproverConfig)
