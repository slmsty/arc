import React from 'react'
import { Table, Button, Form, Row, Col, Input, Icon, message } from 'antd'
import TaxInfoAdd from './taxInfoAdd'

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
      message.success('客户纳税信息保存成功')
      this.setState({
        showAdd: false,
      })
      this.handleQuery()
    }
  }

  componentDidMount() {
    this.handleQuery()
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
        title: '客户名称',
        dataIndex: 'custInfoName',
        width: '17%',
      }, {
        title: '开票客户名称',
        dataIndex: 'billingCustName',
        width: '17%',
      }, {
        title: '纳税人识别码',
        dataIndex: 'taxpayerIdentification',
        width: '10%',
      }, {
        title: '纳税人地址、电话',
        dataIndex: 'addressPhoneNum',
        width: '25%',
      }, {
        title: '开户行及账号',
        dataIndex: 'bankAccount',
        width: '18%',
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

  handleQuery = () => {
    const value = this.props.form.getFieldValue('custName')
    const params = {
      custInfoName: value,
      pageInfo:{
        pageNo: 1,
        pageSize: 10
      },
    }
    this.props.queryCustTaxInfo(params)
  }

  render() {
    const { isLoading, pageInfo, saveCustTaxInfo } = this.props
    const { pageNo, result, count} = pageInfo
    const { getFieldDecorator } = this.props.form
    const pagination = {
      total: count,
      pageNo,
      onChange: (current) => {
        this.props.queryCustTaxInfo({
          custInfoName: this.props.form.getFieldValue('custName'),
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
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('custName')(
                  <Input placeholder="客户名称"/>
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
          rowKey={record => record.custInfoId}
          bordered
          columns={this.getTableColumns()}
          dataSource={result}
          pagination={pagination}
        />
        {
          this.state.showAdd ?
            <TaxInfoAdd
              visible={this.state.showAdd}
              onCancel={() => this.setState({showAdd: false, record: {}})}
              saveCustTaxInfo={saveCustTaxInfo}
              record={this.state.record}
            /> : null
        }
      </div>
    )
  }
}

export default Form.create() (CustomerTaxInfo)
