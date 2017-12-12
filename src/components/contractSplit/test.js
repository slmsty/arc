/**
 * Created by liangshuang on 17/12/12.
 */
/**
 * Created by liangshuang on 17/12/8.
 */
import React from 'react'
import PropTypes from 'prop-types'
import SelectSbu from '../common/SelectSbu'
import { Modal, Form, Table, Row, Col, Button, Input, Checkbox, DatePicker, Select } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const tableData = []

const EditableCell = ({ value, onChange }) => (
  <div>
    {/* <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} /> */}
    <SelectSbu />
  </div>
)
for (let i = 0; i < 4; i++) {
  tableData.push({
    contractType: `类型${i}`,
    projectLine: `产品线${i}`,
    settleType: `结算方式${i}`,
  })
}
class ContractSplitModal extends  React.Component{
  state = {
    dataSource: tableData,
  }
  handleChange(value, index, columns) {
    const newData = [...this.state.dataSource]
    newData[index][columns]=value
    console.log(newData[index][columns])
    this.setState({ dataSource: newData })
  }
  closeClaim = () => {
    this.props.closeModal()
  }
  handleAdd = () => {
    const newData = {
      key: 0,
      contractType: '',
      projectLine: '',
      settleType: '',
    }
    tableData.push(newData)
    this.setState({
      dataSource: tableData,
    })
  }
  handleMinus = (_index) => {
    this.state.dataSource.splice(_index, 1)
    const newData = this.state.dataSource
    this.setState({
      data: newData,
    })
  }
  handleOk = () => {
    const param = this.props.form.getFieldsValue()
    console.log('param', param)
  }
  renderColumns(text, index, column) {
    return (
      <EditableCell
        value={text}
        onChange={value => this.handleChange(value, index, column)}
      />
    )
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: 'Task操作',
      dataIndex: 'taskOpration',
      width: 150,
      textAlign: 'center',
      fixed: 'left',
      render: (text, record, index) => (
        <div>
          <Button onClick={this.handleAdd}>＋</Button>&nbsp;&nbsp;
          <Button onClick={() => this.handleMinus(index)}>－</Button>
        </div>
      ),
    }, {
      title: <span>合同类型<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'contractType',
      width: 100,
      render: (text, record, index) => this.renderColumns(text, index, 'contractType'),
    }, {
      title: <span>产品线<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'projectLine',
      width: 150,
    }, {
      title: <span>结算方式<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'settleType',
      width: 100,
    }, {
      title: <span>目录价<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'catalogue',
      width: 150,
    }, {
      title: <span>折扣<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'discount',
      width: 150,
    }, {
      title: '折后合同额',
      dataIndex: 'discountMoney',
      width: 150,
    }, {
      title: '合同含税额',
      dataIndex: 'SaleBU',
      width: 100,
    }, {
      title: '合同税率',
      dataIndex: 'projectBU',
      width: 150,
    }, {
      title: '合同不含税额',
      dataIndex: 'salePeo',
      width: 150,
    }, {
      title: <span>退税率<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'contractDate',
      width: 150,
    }, {
      title: '退税收入含税额',
      dataIndex: 'contractType1',
      width: 200,
    }, {
      title: 'Gross Order',
      dataIndex: 'currentMoney1',
      width: 100,
    }, {
      title: <span>服务期起始<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'currentMoney2',
      width: 100,
    }, {
      title: <span>服务期结束<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'currentMoney3',
      width: 100,
    },
    ]
    return (
      <div>
        <Modal
          width={1024}
          title="合同拆分"
          visible={this.props.ModalVisible}
          onCancel={this.closeClaim}
          footer={[
            <Button key="submit" onClick={this.handleOk}>
              保存
            </Button>,
            <Button key="back" onClick={this.handleOk}>
              取消
            </Button>,
          ]}
        >
          <div>
            <Form>
              <h2>合同OrderList信息</h2>
              <br />
              <Row className="contractRowBorder text-css">
                <Col span={4}>
                  合同名称：
                </Col>
                <Col span={20} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    合同名称测试
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderBottom">
                <Col span={4}>
                  合同编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    合同编码测试
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  签约公司：
                </Col>
                <Col span={12} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    签约公司测试
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight">
                <Col span={4}>
                  签约日期：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    签约日期测试
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  合同总金额：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    合同总金额测试
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  A-第三方产品：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    A-第三方产品测试
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4}>
                  B-集成服务：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    B-集成服务测试
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  C-软件解决方案：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    C-软件解决方案测试
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  D-培训：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    D-培训测试
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4}>
                  软件解决方案保修期：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    软件解决方案保修期测试
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  维护服务开始时间：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    维护服务开始时间测试
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  维护服务结束时间：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    维护服务结束时间测试
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4}>
                  保修期开始时间<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {getFieldDecorator('preservePeriodStartDate', {
                      initialValue: '0',
                    })(
                      <Select className="contractRowBorderNo">
                        <Option value="0">交货</Option>
                        <Option value="1">开通</Option>
                        <Option value="2">上线</Option>
                        <Option value="3">初验</Option>
                        <Option value="4">终验</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  合同拆分操作人：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    彭红
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  关联BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('sbuInfo')(<SelectSbu />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4}>
                  C-FORM版本GM%：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    50%
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  收入结算方式<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={12} className="contractRowBorderLeft" style={{ textAlign: 'left'}}>
                  <FormItem>
                    {getFieldDecorator('jiesuanType', {
                      initialValue: 'B',
                    })(
                      <Checkbox.Group>
                        <Checkbox value="A">POC</Checkbox>
                        <Checkbox value="B">RATABLY</Checkbox>
                        <Checkbox value="FA">FA</Checkbox>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <br />
              <h2>项目信息</h2>
              <br />
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4}>
                  项目编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    CS543546576
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  项目立项部门：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    产品测试部
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  项目经理：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    彭红
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4}>
                  是否集采项目：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    是
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  立项BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('lixiangsbuInfo')(<SelectSbu/>)
                    }
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  Sales签约BU：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    测试BU
                  </div>
                </Col>
              </Row>
              <br />
              <br />
              <Row>
                <Col span={2}>
                  <h2>合同拆分</h2>
                </Col>
                <Col>
                  <Button onClick={this.handleAdd}>新增</Button>
                </Col>
              </Row>
              <br />
              <Table
                bordered
                columns={columns}
                size="middle"
                scroll={{ x: '2000px' }}
                dataSource={this.state.dataSource}
              />
              <h2>外购成本预算</h2>
              <br />
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  Task 3T cost(第三方软件成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  Task 4T cost(第三方软件支持成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  Task 5 cost(外购硬件设备成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  Task 9 cost(外购支持服务成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  关联公司成本：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  关联分包费：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={5}>
                  合计：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
              </Row>
              <br />
              <br />
              <h2>拆分备注</h2>
              <br />
              <TextArea rows={4} />
              <br />
              <br />
              <h2>Order</h2>
              <Row className="text-css contractRowBorder">
                <Col span={4}>
                  Gross Order：
                </Col>
                <Col span={4} className="contractRowBorderLeft contractRowBorderRight">
                  <Input className="contractRowBorderNo" />
                </Col>
                <Col span={4}>
                  Net Order(Legal)：
                </Col>
                <Col span={4} className="contractRowBorderLeft contractRowBorderRight">
                  <Input className="contractRowBorderNo" />
                </Col>
                <Col span={4}>
                  Net Order（Management)：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" />
                </Col>
              </Row>
              <br />
              <br />
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}
const ContractSplitModalWithForm = Form.create()(ContractSplitModal)

export default ContractSplitModalWithForm
