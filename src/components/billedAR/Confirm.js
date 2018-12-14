import React, {Component} from 'react'
import {Form, Row, Col, DatePicker, Input, Button, Table, Modal, message, Select} from 'antd';
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
import SelectInvokeApi from '../common/selectInvokeApi'
import requestJsonFetch from '../../http/requestJsonFecth'
import ARModal from './ARModal'
import GlDateModal from './glDateModal'
import currency from '../../util/currency'
import {pageSizeOptions} from '../billApplication/billColumns'
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class Confirm extends Component {
  state = {
    visible: false,
    o: {},
    rowKeys: [],
    rows: [],
    editDis: true,
    rejectDis: true,
    approvalDis: true,
    sendDis: true,
    isSend: false,
    failures: [],
    sLength: 0,
    fLength: 0,
    tableHeight: '',
    glDateModal: false,
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '数据状态',
        fixed: 'left',
        dataIndex: 'statusName',
        width: 120,
      },
      {
        title: '签约公司',
        dataIndex: 'companyShow',
        width: 400,
      },
      {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 120,
      },
      {
        title: '节点',
        dataIndex: 'projectNode',
        width: 120,
      },
      {
        title: '付款阶段(里程碑)',
        dataIndex: 'paymentPhrases',
        width: 120,
      },
      {
        title: '付款条款',
        dataIndex: 'paymentName',
        width: 120,
      },
      {
        title: '付款百分比',
        dataIndex: 'paymentPercent',
        width: 120,
      },
      {
        title: <span>GL日期<em style={{color: '#FF0000'}}>*</em></span>,
        dataIndex: 'glDate',
        width: 120,
      },
      {
        title: <span>Billed AR日期<em style={{color: '#FF0000'}}>*</em></span>,
        dataIndex: 'billedArDate',
        width: 120,
      },
      {
        title: <span>Billed AR金额<em style={{color: '#FF0000'}}>*</em></span>,
        dataIndex: 'billedArAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '备注',
        dataIndex: 'arAccountantApproveMessage',
        width: 120,
      },
      {
        title: '款项ID',
        dataIndex: 'fundId',
        width: 120,
      },
      {
        title: '合同币种',
        dataIndex: 'contractCurrency',
        width: 120,
      },
      {
        title: '合同金额',
        dataIndex: 'contractAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '合同编码',
        dataIndex: 'contractNo',
        width: 400,
      },
      {
        title: '合同名称',
        dataIndex: 'contractName',
        width: 700,
      },
      {
        title: '客户名称',
        dataIndex: 'custName',
        width: 400,
      },
      {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 120,
      },
      {
        title: '应收日期',
        dataIndex: 'arDate',
        width: 120,
      },
      {
        title: '报告日期',
        dataIndex: 'reportDate',
        width: 120,
      },
      {
        title: '付款金额',
        dataIndex: 'paymentAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '应收金额',
        dataIndex: 'arAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '考核含税金额',
        dataIndex: 'assessTaxIncludedAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '收入额',
        dataIndex: 'revenueAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '提示',
        dataIndex: 'reminder',
        width: 400,
      },
    ];
    this.columns2 = [
      {
        title: 'id',
        dataIndex: 'id',
        width: 150,
      }, {
        title: '详细信息',
        dataIndex: 'remark',
      }
    ]
  }

  componentWillMount() {
    const screenHeight = window.screen.height;
    // 屏幕高-header高64-margin8-padding12-查询条件div168-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 24 - 126 - 56 - 28 - 24 - 160;
    this.setState({tableHeight})
  }

  componentDidMount() {
    this.doSearch()
  }

  doSearch = (e)=> {
    //e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        rowKeys: [],
        rows: [],
        editDis: true,
        rejectDis: true,
        approvalDis: true,
        sendDis: true
      });
      this.props.Search({
        pageInfo: {
          pageNo: 1,
          pageSize: this.props.pageSize
        },
        ...values
      })
    })
  };

  pageSizeChange = (current, size)=> {
    this.props.form.validateFields((err, values) => {
      this.setState({
        rowKeys: [],
        rows: [],
        editDis: true,
        rejectDis: true,
        approvalDis: true,
        sendDis: true
      });
      this.props.Search({
        pageInfo: {
          pageNo: 1,
          pageSize: size
        },
        ...values
      })
    })
  };

  pageNoChange = (page, pageSize)=> {
    this.props.form.validateFields((err, values) => {
      this.props.Search({
        pageInfo: {
          pageNo: page,
          pageSize: pageSize
        },
        ...values
      })
    });
  };

  rowSelectionChange = (selectedRowKeys, selectedRows)=> {
    let rowKeys = this.state.rowKeys;
    let rows = this.state.rows;
    selectedRowKeys.forEach(key=> {
      if (!rowKeys.includes(key)) {
        rows.push(selectedRows.find(o=>o.billedArId === key))
      }
    });
    rows = rows.filter(o=>selectedRowKeys.includes(o.billedArId));
    rowKeys = selectedRowKeys;

    this.setState({
      rowKeys: rowKeys,
      rows: rows,
      editDis: !(rows.length === 1 && rows.every(o=>o.status === 'NEW' || o.status === 'ACCOUNT_CONFIRMING' || o.status === 'CONFIRM_NEEDLESS' || o.status === 'PA_PUSHING' || o.status === 'PA_PUSH_ERROR')),
      rejectDis: !(rows.length > 0 && rows.every(o=>o.status === 'ACCOUNT_CONFIRMING' || o.status === 'PA_PUSHING')),
      approvalDis: !(rows.length > 0 && rows.every(o=>o.status === 'ACCOUNT_CONFIRMING')),
      sendDis: !(rows.length > 0 && rows.every(o=>o.status === 'PA_PUSHING' || o.status === 'PA_PUSH_ERROR')),
    })
  };

  doEdit = ()=> {
    this.setState({
      visible: true,
      o: this.state.rows[0]
    })
  };

  Cancel = ()=> {
    this.setState({visible: false, o: {}})
  };

  OK = ()=> {
    this.props.form.validateFields((err, values) => {
      this.props.Search({
        pageInfo: {
          pageNo: this.props.pageNo,
          pageSize: this.props.pageSize
        },
        ...values
      })
    });

    this.setState({
      visible: false,
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true
    })
  };

  reject = ()=> {
    this.props.Reject(this.state.rowKeys);
    this.setState({
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true
    })
  };

  approval = () => {
    this.props.Approval(this.state.rowKeys).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        let info = this.props.amountInfo;
        let str = '';
        for (let i in this.props.amountInfo) {
          str += `${i}:${this.props.amountInfo[i]}\n`
        }
        Modal.info({
          title: this.props.title,
          content: "Billed AR 金额合计：" + str,
        });
        this.props.ResetTitle()
      } else {
        message.error('加载数据失败')
      }
    });
    this.setState({
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true,
    })
  };

  postSend = (body, callback)=> {
    requestJsonFetch(
      '/arc/billedar/confirm/pushPa',
      {
        method: 'POST',
        body
      },
      callback
    )
  };
  selectCancel = () => {
    this.setState({
      glDateModal: false,
    })
  };
  selectOk = (param) => {
    this.postSend({
      billedArIds: this.state.rowKeys,
      glDate: param
    }, response=> {
      this.setState({
        glDateModal: false,
      });
      if (response.resultCode === '000000') {
        let result = response.successFailureResult;
        if (!result.failures && result.failures.length <= 0) {
          this.closeSend();
        } else {
          this.setState({
            isSend: true,
            sLength: result.successIds.length,
            fLength: result.failures.length,
            failures: result.failures,
          })
        }
      } else {
        message.error(response.resultMessage);
      }
    });
    this.setState({
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true,
    })
  };
  send = () => {
    this.setState({
      glDateModal: true,
    })
  };

  closeSend = ()=> {
    this.setState({isSend: false});
    this.props.form.validateFields((err, values) => {
      this.props.Search({
        pageInfo: {
          pageNo: this.props.pageNo,
          pageSize: this.props.pageSize
        },
        ...values
      })
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.confirmApproveRefresh !== nextProps.confirmApproveRefresh) {
      this.doSearch()
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const columns = this.columns;
    const {pageNo, pageSize, count, result, loading} = this.props;

    const layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };

    return (
      <div className="billedARConfirm">
        <Form>
          <Row>
            <Col span={8}>
              <FormItem label="Billed AR日期" {...layout}>
                {
                  getFieldDecorator('billedArDate')(<RangePicker/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户名称" {...layout}>
                {
                  getFieldDecorator('custName')(<Input placeholder="客户名称"/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="项目编码(多)" {...layout}>
                {
                  getFieldDecorator('projectNos')(
                    <MultipleInput placeholder="多项目编码使用英文逗号间隔"/>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="GL日期(多)" {...layout}>
                {
                  getFieldDecorator('glDates')(<MultipleDayInput />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="签约公司" {...layout}>
                {
                  getFieldDecorator('companyName')(<Input placeholder="签约公司"/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="合同编码(多)" {...layout}>
                {
                  getFieldDecorator('contractNos')(
                    <MultipleInput placeholder="多合同编码使用英文逗号间隔"/>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="付款条件" {...layout}>
                {
                  getFieldDecorator('paymentTerm', {initialValue: ''})(<SelectInvokeApi
                    typeCode="BILLED_AR"
                    paramCode="PAYMENT_TERM"
                    placeholder="付款条件"
                    hasEmpty
                  />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="款项ID" {...layout}>
                {
                  getFieldDecorator('fundId', {initialValue: ''})(<Input
                    placeholder="款项ID"
                    hasEmpty
                  />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="数据状态" {...layout}>
                {
                  getFieldDecorator('status', {initialValue: 'ACCOUNT_CONFIRMING'})(<SelectInvokeApi
                    typeCode="BILLED_AR"
                    paramCode="STATUS"
                    placeholder="数据状态"
                    hasEmpty
                  />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="billedAr金额" {...layout}>
                {
                  getFieldDecorator('moreLessZero', {
                    initialValue: 'ALL'
                  })(
                    <Select>
                      <Option value="ALL">全部</Option>
                      <Option value="more">大于零</Option>
                      <Option value="less">小于零</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={16} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit" onClick={this.doSearch}>查询</Button>
            </Col>
          </Row>
        </Form>
        <br/>
        <Row>
          <Col span={24}>
            <Button onClick={this.doEdit} style={{marginRight: '20px'}} disabled={this.state.editDis}>编辑</Button>
            <Button onClick={this.reject} style={{marginRight: '20px'}} disabled={this.state.rejectDis}>拒绝</Button>
            <Button onClick={this.approval} style={{marginRight: '20px'}} disabled={this.state.approvalDis}>审批</Button>
            <Button onClick={this.send} disabled={this.state.sendDis}>传送PA</Button>
          </Col>
        </Row>
        <br/>
        <Table
          size="small"
          style={{backgroundColor: '#FFFFFF'}}
          rowKey="billedArId"
          bordered
          loading={loading}
          rowSelection={{
            selectedRowKeys: this.state.rowKeys,
            onChange: this.rowSelectionChange
          }}
          columns={columns}
          dataSource={result}
          pagination={{
            pageSizeOptions,
            showSizeChanger: true,
            onShowSizeChange: this.pageSizeChange,
            showTotal: t=>`共${t}条`,
            onChange: this.pageNoChange,
            current: pageNo,
            pageSize: pageSize,
            total: count
          }}
          scroll={{x: 4580, y: this.state.tableHeight}}/>
        {
          this.state.visible ?
            <ARModal
              visible={this.state.visible}
              onCancel={this.Cancel}
              onOk={this.OK}
              o={this.state.o}
            /> : null
        }
        <Modal
          visible={this.state.isSend}
          onOk={this.closeSend}
          onCancel={this.closeSend}
          title=""
          footer={[
            <Button key="cofirm" type="primary" onClick={this.closeSend}>
              确定
            </Button>,
          ]}>
          <p>成功传送AR：<b style={{color: '#FF0000'}}>{this.state.sLength}</b> 条</p>
          <p>传送AR失败：<b style={{color: '#FF0000'}}>{this.state.fLength}</b> 条</p>
          <br/>
          <Table
            rowKey="id"
            bordered
            size="small"
            columns={this.columns2}
            dataSource={this.state.failures}
            pagination={false}/>
        </Modal>
        <GlDateModal
          selectCancel={this.selectCancel}
          glDateModal={this.state.glDateModal}
          selectOk={this.selectOk}
        />
      </div>
    )
  }
}

export default Form.create()(Confirm)
