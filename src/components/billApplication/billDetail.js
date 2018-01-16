import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Table, Modal, Upload, message, Icon } from 'antd'
import './billDetail.less'
import moment from 'moment'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input

const columns = [{
  title: '开票内容',
  dataIndex: 'content',
  width: 150,
}, {
  title: '规格型号',
  dataIndex: 'xinghao',
  width: 100,
}, {
  title: '单位',
  dataIndex: 'danwei',
  width: 100,
}, {
  title: '数量',
  dataIndex: 'count',
  width: 100,
}, {
  title: '单价',
  dataIndex: 'price',
  width: 100,
}, {
  title: '金额',
  dataIndex: 'money',
  width: 100,
}, {
  title: '税率',
  dataIndex: 'rate',
  width: 100,
}, {
  title: '税额',
  dataIndex: 'rateaccount',
  width: 100,
}]

const totalColumns = [
  {
    title: '',
    dataIndex: 'title',
    width: 80,
  }, {
    title: '税率',
    dataIndex: 'taxRate',
    width: 150,
  }, {
    title: '税额',
    dataIndex: 'tax',
    width: 150,
  }
]

const detailColumns = [{
  title: '',
  dataIndex: 'title',
  width: 80,
}, {
  title: '客户名称',
  dataIndex: 'customerName',
  width: 150,
}, {
  title: '纳税人识别码',
  dataIndex: 'taxPayer',
  width: 150,
}, {
  title: '地址电话',
  dataIndex: 'address',
  width: 150,
}, {
  title: '开户行及账号',
  dataIndex: 'bankAccount',
  width: 150,
}]

const data = [{
  title: '城建',
  taxRate: '5%',
  tax: '2021',
}, {
  title: '教育',
  taxRate: '8%',
  tax: '12000',
}, {
  title: '所得税',
  taxRate: '10%',
  tax: '3000',
}, {
  title: '合计',
  taxRate: '20%',
  tax: '21000',
}]

const detailData = [{
  title: '购买方',
  customerName: '中国移动',
  taxPayer: '212SDFX',
  address: '北京市海淀区知春路010-89332322',
  bankAccount: '招商银行'
}, {
  title: '销售方',
  customerName: '亚信科技',
  taxPayer: '243SDaaFX',
  address: '北京市海淀区中关村',
  bankAccount: '招商银行'
}]

class BillDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [{

      }]
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    const formItemLayout1 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    }
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className="billing">
      <Modal
        title="发票编辑"
        width="1000px"
        style={{ top: 20 }}
        visible={this.props.visible}
        wrapClassName="vertical-center-modal"
        onOk={this.handleOk}
        okText="开票"
        onCancel={() => this.props.onCancel()}
      >
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="费用承担着">
                {getFieldDecorator('costCommit')(
                  <Select>
                    <Option value='1'>项目</Option>
                    <Option value='2'>部门</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="开票类型">
                {
                  getFieldDecorator('billType',{
                    initialValue: '',
                  })(
                    <Select>
                      <Option value='1'>项目</Option>
                      <Option value='2'>部门</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="开票日期">
                {
                  getFieldDecorator('billingDate')(
                    <DatePicker format="YYYY-MM-DD"/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Table
            rowKey="id"
            size="small"
            bordered
            columns={detailColumns}
            dataSource={detailData}
            pagination={false}
          />
          <div className="add-btns">
            <Button type="primary" ghost onClick={() => this.setState({visible: true})}>新增</Button>
          </div>
          <Table
            style={{marginBottom: '10px'}}
            rowKey="receiptClaimId"
            bordered
            size="small"
            columns={columns}
            dataSource={[]}
          />
          <Row gutter={40}>
            <Col span={14}>
              <FormItem {...formItemLayout1} label="附件">
                {
                  getFieldDecorator('file')(
                    <Upload {...props}>
                      <Button>
                        <Icon type="upload" />点击上传
                      </Button>
                    </Upload>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={14}>
              <FormItem {...formItemLayout1} label="开票要求">
                {
                  getFieldDecorator('requirements')(
                    <TextArea placeholder="请输入开票要求" rows="3" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Table
            style={{width: '50%'}}
            rowKey="id"
            size="small"
            bordered
            columns={totalColumns}
            dataSource={data}
            pagination={false}
          />
        </Form>
      </Modal>
      </div>
    )
  }
}

export default Form.create()(BillDetail)

