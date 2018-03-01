/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import currency from '../../util/currency'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from '../billApplication/selectSearch'
import moment from 'moment'
import { Modal, Row, Col, Button, Input, Form, Table, message, Select, DatePicker, InputNumber } from 'antd'
import { detailColumns } from '../billApplication/billColumns'

const { TextArea } = Input
const Option = Select.Option
const FormItem = Form.Item
let No = parseInt(0)
const contentCols = [{
  title: '内容名称',
  dataIndex: 'billingContentName',
  width: 200,
}, {
  title: '内容',
  dataIndex: 'billingRecordId',
  width: 200,
}]

class CancelDetail extends React.Component {
  state = {
    selectedRowKeys: '',
    selectedRows: '',
    disableDis: true,
    showNewApplayDis: true,
    contentData: [],
    invoiceRequire: '',
    remark: '',
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    if(selectedRowKeys.length){
      this.setState({
        disableDis: false,
      })
    }else{
      this.setState({
        disableDis: true,
      })
    }
    this.setState({ selectedRowKeys, selectedRows })
  }
  // 作废
  retBillItem = () => {
    const param = this.props.form.getFieldsValue()
    param.invoiceDate = param.invoiceDate && param.invoiceDate.length ? param.invoiceDate.format('YYYY-MM-DD') : ''
    const selectData = this.state.contentData
    const params={
      applicationId: this.props.data[0].applicationId,
      applineId: this.state.selectedRows[0].billingLineId,
      outcomeId: this.props.data[0].outcomeId,
      invalidAmount: this.state.selectedRows[0].invalidAmount,
      isAgainInvoice: this.state.showNewApplayDis,
      appLineItems:this.props.DetailList,
      remark:this.state.remark,
      invoiceRequire:this.state.invoiceRequire,

    }
    console.log('params',params)
    this.props.disableApprove(params)
  }
  editContentLine = (flag) => {
    if(this.state.selectedRows.length==0){
      message.error('请选择数据')
      return
    }
    if(this.state.selectedRows.length>1){
      message.error('一次只能对一条数据进行操作')
      return
    }
    const selectData = this.state.selectedRows
     const selectKey = this.state.selectedRowKeys
     const addData = {
       billingContent: '',
       specificationType: '',
       unit: '',
       quantity: 1,
       unitPrice: '',
       billingAmount: '',
       billingTaxRate: '',
       billingTaxAmount: '',
       arBillingId:'',
       contractItemId:'',
       lineNo:'',
       addFlag: true,
       groupNo:'',
     }
    let propsData = this.state.contentData.length ? this.state.contentData : this.props.DetailList
    console.log('length',propsData)
    if(flag=='add'){
      addData.arBillingId = selectData[0].arBillingId
      addData.contractItemId = selectData[0].contractItemId
      addData.lineNo = Number(selectKey) + 1
      propsData.splice(Number(selectKey) + 1, 0, addData)
      this.setState({
        selectedRows: '',
        selectedRowKeys: '',
      })
    }
    if(flag =='del' && selectData[0].addFlag ){
      propsData.splice(Number(selectKey), 1)
      this.setState({
        selectedRows: '',
        selectedRowKeys: '',
      })
    }
    this.setState({
      contentData: propsData,
    })
  }
  handleChangle = (e,index,colum) => {
    let contentData = this.state.contentData
    contentData[index][colum] = e.target.value
    this.setState({
      contentData: contentData,
    })
  }
  inSameBill = () => {
    No++
    const selectData = this.state.selectedRowKeys
    const contentData = this.state.contentData
    selectData.map((item,index)=>{
      contentData.map((item2,index2)=>{
        if(item==index2){
          item2.groupNo = No
        }
      })
    })
    this.setState({
      selectedRows: '',
      selectedRowKeys: '',
      contentData: contentData,
    })
  }
  handleContentChange = (value, col, index) => {
    console.log(value, col, index)
    let dataSource = this.state.contentData.length ? this.state.contentData : this.props.DetailList
    if(col === 'billingContent') {
      dataSource[index][col] = value[1]
    } else {
      dataSource[index][col] = value
    }

    this.setState({
      contentData: dataSource
    })
  }
  onTextAreaChange = (e) => {
    const value = e.target.value
    this.setState({
      remark: value,
    })
  }
  onTextAreaRequireChange = (e) => {
    const value = e.target.value
    this.setState({
      invoiceRequire: value,
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    let dataSource = this.props.data
    let detailDatas = this.props.applyData[0]
    const detailData = [{
      title: '购买方',
      customerName: detailDatas.customerName,
      taxPayer: detailDatas.customerTaxIdentifyCode,
      address: detailDatas.customerAddressPhone,
      bankAccount: detailDatas.customerBackAccount,
    }, {
      title: '销售方',
      customerName: detailDatas.companyName,
      taxPayer: detailDatas.companyTaxIdentifyCode,
      address: detailDatas.companyAddressPhone,
      bankAccount: detailDatas.companyBackAccount,
    }]
    const columns = [
      {
        title: '操作',
        dataIndex: 'action',
        width: 60,
        fixed: 'left',
        render: (text, record, index) => (
          <div>
            {
              record.isParent === 1 ?
                <Button type="primary" ghost onClick={() => this.handleAdd(record.lineNo, record.arBillingId, record.contractItemId)}>+</Button>
                : null
            }
            {
              record.isParent === 0 ?
                <Button type="primary" ghost onClick={() => this.handleDelete(record)}>-</Button>
                : null
            }
          </div>
        )
      }, {
        title: '组号',
        dataIndex: 'groupNo',
        width: 50,
        fixed: 'left',
      }, {
        title: '开票内容',
        dataIndex: 'billingContent',
        width: 200,
        render: (text, record, index) => (
          <SelectSearch
            url="/arc/billingApplication/billingContent/search"
            columns={contentCols}
            label="开票内容"
            width="1000px"
            idKey="billingRecordId"
            valueKey="billingContentName"
            value={['', this.state.dataSource[index]['billingContent']]}
            onChange={(v) => this.handleChange(v, 'billingContent', index)}
          />
        )
      }, {
        title: '规格型号',
        dataIndex: 'specificationType',
        width: 100,
        render: (text, record, index) => (
          <Input placeholder="规格型号" value={this.state.dataSource[index]['specificationType']} onChange={(e) => this.handleChange(e.target.value, 'specificationType', index)}/>
        )
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: 80,
        render: (text, record, index) => (
          <Input placeholder="单位" value={this.state.dataSource[index]['unit']}  onChange={(e) => this.handleChange(e.target.value, 'unit', index)} />
        )
      }, {
        title: '数量',
        dataIndex: 'quantity',
        width: 70,
        render: (text, record, index) => (
          <InputNumber
            placeholder="数量"
            defaultValue="1"
            min={0}
            value={this.state.dataSource[index]['quantity']}
            onChange={(value) => this.handleChange(value, 'quantity', index)} />
        )
      }, {
        title: '单价',
        dataIndex: 'unitPrice',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="单价"
            min={0}
            value={this.state.dataSource[index]['unitPrice']}
            onChange={(value) => this.handleChange(value, 'unitPrice', index)}
          />
        )
      }, {
        title: '不含税金额',
        dataIndex: 'billingAmountExcludeTax',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="不含税金额"
            min={0}
            value={this.state.dataSource[index].billingAmountExcludeTax}
            onChange={(value) => this.handleChange(value, 'billingAmountExcludeTax', index, record)}/>
        )
      }, {
        title: '含税金额',
        dataIndex: 'billingAmount',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="含税金额"
            min={0}
            defaultValue={record.billingAmount}
            value={this.state.dataSource[index]['billingAmount']}
            onChange={(value) => this.handleChange(value, 'billingAmount', index, record)}/>
        )
      }, {
        title: '税率',
        dataIndex: 'billingTaxRate',
        width: 100,
        render: (text, record, index) => (
          <SelectInvokeApi
            typeCode="BILLING_APPLICATION"
            paramCode="TAX_RATE"
            placeholder="税率"
            hasEmpty={false}
            value={`${this.state.dataSource[index]['billingTaxRate']}`}
            onChange={(v) => this.handleChange(v, 'billingTaxRate', index)}
          />
        )
      }, {
        title: '税额',
        dataIndex: 'billingTaxAmount',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="税额"
            min={0}
            value={this.state.dataSource[index]['billingTaxAmount']}
            onChange={(value) => this.handleChange(value, 'billingTaxAmount', index)}
          />
        )
      }]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <Modal
          width={1024}
          title="作废详情"
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onOk}
          footer={
            <div>
              <Button onClick={this.retBillItem}>
                开票
              </Button>
            </div>
          }
        >
          <Form>
            <Row gutter={40}>
              <Col span={8} key={1}>
                <FormItem {...formItemLayout} label="是否重新开票:">
                  {getFieldDecorator('isAgainInvoice',{
                    initialValue: 'true',
                  })(
                    <Select onChange={(v) => this.setState({showNewApplayDis: v === 'true' ? true : false })}>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  )}

                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8} key={2}>
                <FormItem {...formItemLayout} label="开票类型">
                  {
                    getFieldDecorator('invoiceType',{
                      initialValue: '',
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="BILLING_TYPE"
                        placeholder="开票类型"
                        hasEmpty
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} key={3}>
                <FormItem {...formItemLayout} label="开票日期">
                  {
                    getFieldDecorator('invoiceDate',{
                      initialValue: moment(),
                    })(
                      <DatePicker format="YYYY-MM-DD"/>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <br />
            {
              this.state.showNewApplayDis ?
                <div>
                  <Table
                    rowKey="receiptClaimId"
                    columns={detailColumns}
                    pagination={false}
                    bordered
                    size="small"
                    scroll={{x: '750px'}}
                    dataSource={detailData}
                  />
                  <div className="add-btns">
                    <Button type="primary" style={{marginLeft: '5px'}} ghost onClick={() => this.billingUnify()}>统一开票</Button>
                  </div>
                  <Table
                    rowSelection={rowSelection}
                    style={{marginBottom: '10px'}}
                    rowKey="lineNo"
                    bordered
                    size="small"
                    columns={columns}
                    pagination={false}
                    dataSource={this.state.dataSource}
                    scroll={{ x: 1160 }}
                  />
                  <br /><br />
                  <div>
                    <span style={{display:'inline-block'}}>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
                    <span style={{display:'inline-block',verticalAlign:'text-top',width:'931px'}}><TextArea value={this.state.remark} onChange={(e)=>this.onTextAreaChange(e)} /></span>
                  </div>
                  <div style={{marginTop:'20px'}}>
                    <span style={{display:'inline-block'}}>开票要求：</span>
                    <span style={{display:'inline-block',verticalAlign:'text-top',width:'931px'}}><TextArea value={this.state.invoiceRequire} onChange={(e)=>this.onTextAreaRequireChange(e)} /></span>
                  </div>
                </div>
              : null
            }
          </Form>
        </Modal>
      </div>
    )
  }
}
CancelDetail.propTypes = {
  closeClaim: PropTypes.func,
  applyReject: PropTypes.func,
  applyComfirm: PropTypes.func,
  infoVisitable: PropTypes.bool,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const CancelModalWithForm = Form.create()(CancelDetail)

export default CancelModalWithForm
