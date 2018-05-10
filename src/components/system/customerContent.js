import React from 'react'
import { Table, Button, Form, Row, Col, Input, Icon } from 'antd'
import ContentAdd from './contentAdd'
import {message} from "antd/lib/index";

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
}
class CustomerTaxInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdd: false,
      record: {},
    }
  }

  componentWillReceiveProps(nextPorps) {
    if(this.props.saveSuccess !== nextPorps.saveSuccess && nextPorps.saveSuccess) {
      message.success('开票内容信息保存成功')
      this.setState({
        showAdd: false,
      })
      this.handleQuery()
    }
  }

  componentDidMount() {
    this.handleQuery()
  }

  handleQuery = () => {
    const value = this.props.form.getFieldValue('billingContentName')
    const params = {
      billingContentName: value,
      pageInfo:{
        pageNo: 1,
        pageSize: 10
      },
    }
    this.props.queryInvoiceTaxInfo(params)
  }

  handleEdit = (record) => {
    this.setState({
      record,
      showAdd: true,
    })
  }

  getTableColumns = () => {
    const columns = [
      {
        title: '开票内容编码',
        dataIndex: 'billingContentCode',
        width: '25%',
      }, {
        title: '开票内容名称',
        dataIndex: 'billingContentName',
        width: '25%',
      }, {
        title: '纳税人识别码',
        dataIndex: 'taxCategoryCode',
        width: '10%',
      }, {
        title: '优惠政策标识',
        dataIndex: 'prefPolicySign',
        width: '8%',
        render: (text) => {
          return text === '1' ? '使用' : '不使用'
        }
      }, {
        title: '税收分类编码版本号',
        dataIndex: 'taxCategoryVersion',
        width: '8%',
      }, {
        title: '扣除额',
        dataIndex: 'taxIncludeAmount',
        width: '5%',
      }, {
        title: '是否有效',
        dataIndex: 'status',
        width: '5%',
        render: (text) => {
          return text === 'Y' ? '是' : '否'
        }
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

  render() {
    const { isLoading, taxPageInfo } = this.props
    const { pageNo, result, count} = taxPageInfo
    const { getFieldDecorator } = this.props.form
    const pagination = {
      total: count,
      pageNo,
      onChange: (current) => {
        this.props.queryInvoiceTaxInfo({
          billingContentName: this.props.form.getFieldValue('billingContentName'),
          pageInfo:{
            pageNo: current,
            pageSize: 10
          },
        })
      }
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={10}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="开票内容名称">
                {getFieldDecorator('billingContentName')(
                  <Input placeholder="开票内容名称"/>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2} style={{ textAlign: 'left' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
        <div style={{margin: '10px 0'}}>
          <Button type="primary" onClick={() => this.setState({showAdd: true})} ghost>新增</Button>
        </div>
        <Table
          loading={isLoading}
          rowKey={record => record.key}
          bordered
          columns={this.getTableColumns()}
          dataSource={result}
          pagination={pagination}
        />
        {
          this.state.showAdd ?
            <ContentAdd
              visible={this.state.showAdd}
              onCancel={() => this.setState({showAdd: false, record: {}})}
              saveInvoiceTaxInfo={this.props.saveInvoiceTaxInfo}
              record={this.state.record}
            /> : null
        }
      </div>
    )
  }
}

export default Form.create() (CustomerTaxInfo)
