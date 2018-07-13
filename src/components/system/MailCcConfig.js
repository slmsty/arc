import React from 'react'
import { Table, Button, Form, Row, Col, Input, Icon, message, Select, TreeSelect } from 'antd'
import MailCcConfigAdd from './MailCcConfigAdd'
import SelectSbu from '../common/SelectSbu'
import InputSearch from '../billApplication/inputSearch'
import {provinceCols} from "../billApplication/billColumns";

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
}
class MailCcConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdd: false,
      record: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.saveSuccess !== nextProps.saveSuccess && nextProps.saveSuccess) {
      message.success('保存成功')
      this.setState({
        showAdd: false,
        record: {},
      })
      this.handleQuery()
    }
  }

  componentDidMount() {
    this.handleQuery()
    this.props.queryRegionList({
      keywords: ''
    })
  }

  handleEdit = (record) => {
    this.setState({
      record,
      showAdd: true,
    })
  }
  clearFormValues = () => {
    this.props.form.resetFields()
  }

  getTableColumns = () => {
    const columns = [
      {
        title: 'BU',
        dataIndex: 'sbuName',
        width: '10%',
        render: (text, record) => (`${record.sbuNo}:${text}`)
      }, {
        title: '立项区域',
        dataIndex: 'region',
        width: '10%',
      }, {
        title: '省份',
        dataIndex: 'province',
        width: '10%',
      }, {
        title: '抄送人',
        dataIndex: 'email',
        width: '55%',
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
      province: value.province ? (value.province.provinceName === '全部' ? 'ALL' : value.province.provinceName) : '',
      sbuNo: value.sbuNo && value.sbuNo.length > 0 ? value.sbuNo[0] : '',
      pageInfo:{
        pageNo: pageNo || 1,
        pageSize: pageSize || 10
      },
    }
    this.props.queryMailCcConfig(params)
  }

  render() {
    const { isLoading, mailCcConfig, saveMailCcConfig } = this.props
    const { pageNo, result, count} = mailCcConfig
    const { getFieldDecorator } = this.props.form
    const pagination = {
      total: count,
      showTotal: (total) => (`共 ${total} 条`),
      current: pageNo,
      onChange: (current) => {
        this.handleQuery(current)
      },
      showSizeChanger: true,
      onShowSizeChange: (current, size) => {
        this.handleQuery(current, size)
      },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={10}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="立项BU">
                {getFieldDecorator('sbuNo')(
                  <SelectSbu/>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="立项区域">
                {getFieldDecorator('region', {
                })(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.props.regionList}
                    placeholder="请选择立项区域"
                    showSearch={true}
                    treeNodeFilterProp='label'
                    allowClear={true}
                    searchPlaceholder="根据区域名筛选"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="省份">
                {getFieldDecorator('province', {
                })(
                  <InputSearch
                    url="/arc/common/province/list"
                    columns={provinceCols}
                    label="省份"
                    idKey="provinceName"
                    valueKey="provinceName"
                    showSearch={true}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={23} key={1} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
              <Button type="primary" ghost style={{marginLeft: '15px'}} onClick={this.clearFormValues}><Icon type="delete" />清空</Button>
            </Col>
          </Row>
        </Form>
        <div style={{margin: '10px 0'}}>
          <Button type="primary" onClick={() => this.setState({showAdd: true})} ghost>新增</Button>
        </div>
        <Table
          loading={isLoading}
          rowKey={record => record.emailId}
          bordered
          size="small"
          columns={this.getTableColumns()}
          dataSource={result}
          pagination={pagination}
        />
        {
          this.state.showAdd ?
            <MailCcConfigAdd
              visible={this.state.showAdd}
              onCancel={() => this.setState({showAdd: false, record: {}})}
              saveMailCcConfig={saveMailCcConfig}
              record={this.state.record}
              regionList={this.props.regionList}
            /> : null
        }
      </div>
    )
  }
}

export default Form.create() (MailCcConfig)
