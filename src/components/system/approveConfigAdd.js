import React from 'react'
import { Form, Button, Row, Col, Modal, Icon, Input, InputNumber, Select, TreeSelect, Table } from 'antd'
import SelectSbu from '../common/SelectSbu'
import SelectSearch from '../billApplication/selectSearch'
import ApproveSearch from './approveSearch'
import {comCols} from "../billApplication/billColumns";
const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
}
const formItemLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20},
}
const columns = [
  {
    title: '员工编号',
    dataIndex: 'staffCode',
    width: 100,
  }, {
    title: '员工姓名',
    dataIndex: 'staffName',
    width: 100,
  }, {
    title: '员工邮箱',
    dataIndex: 'email',
    width: 100,
  }
]
class ApproveConfigAdd extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: '',
      addLoading: false,
      subNoEdit: false,
      regionEdit: false,
    }
    this.personInfos = props.action === 'Edit' ? props.record.personInfos.map(item => ({
      nodePersonId: item.nodePersonId,
      isActive: item.isActive,
    })) : []
    this.isAdd = props.action === 'Add'
    this.isEdit = props.action === 'Edit'
    this.columns = [
      {
        title: '人员',
        dataIndex: 'personName',
        width: 100,
        render: (text, record) => (`${record.personName}(${record.personNumber})`)
      }, {
        title: '是否有效',
        dataIndex: 'isActive',
        width: 100,
        render:(text, record, index) =>
          <Select defaultValue={text} onChange={(v) => this.handleSelectChange(v, index)}>
            <Option value='Y'>是</Option>
            <Option value='N'>否</Option>
          </Select>
      }]
  }

  componentDidMount() {
    const { nodeCode } = this.props.record
    if(this.props.action === 'Copy') {
      this.setEditStatus(nodeCode)
    }
  }

  handleSelectChange = (v, index) => {
    this.personInfos[index].isActive = v
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          addLoading: true
        })
        const params = this.isEdit ? {
          actionType: 'EDIT',
          personInfos: this.personInfos,
        } : {
          ...values,
          companyId: values.companyId.length > 0 ? values.companyId[0] : '',
          sbuNo: values.sbuNo.length > 0 ? values.sbuNo[0] : '',
          sbuName: values.sbuNo.length > 0 ? values.sbuNo[1] : '',
          personIds: values.personIds.map(item =>
            item.replace(/.*\((\d+)\)$/, '$1')
          ),
          actionType: 'NEW',
        }
        this.props.saveApprovePerson(params).then(res => {
          if(res) {
            this.setState({
              addLoading: false
            })
          }
        })
      }
    });
  }

  handleChange = (value) => {
    this.props.form.setFieldsValue({
      personIds: value
    })
  }

  setEditStatus = (value) => {
    const approveNode = this.props.approveNodeList.find(item => item.nodeCode === value)
    let subNoEdit = false
    let regionEdit = false
    if(approveNode.condition) {
      const nodeList = approveNode.condition.split(',')
      if(nodeList.includes('sbuNo')) {
        subNoEdit = true
      }
      if(nodeList.includes('projectRegion')) {
        regionEdit = true
      }
    } else {
      subNoEdit = false
      regionEdit = false
    }
    this.setState({
      subNoEdit,
      regionEdit
    })
  }

  handleApproveChange = (value) => {
    this.setEditStatus(value)
    this.props.form.setFieldsValue({
      sbuNo: '',
      projetRegion: ''
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { nodeCode, personInfos, projectBu, sbuNo, sbuName, projectRegion, companyName, companyId } = this.props.record

    return (
      <div>
        <Modal
          width="700px"
          title="审批人配置"
          visible={this.props.visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" loading={this.state.addLoading} onClick={(e) => this.handleOk(e)}>
              {!this.state.addLoading ? <Icon type="check" /> : ''}保存
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="签约公司">
                  {getFieldDecorator('companyId',
                    {initialValue: companyId ? [companyId, companyName] : '', rules: [{ required: this.isAdd, message: '请选择签约公司!' }]})(
                    <SelectSearch
                      width='700px'
                      url="/arc/billingApplication/company/search"
                      columns={comCols}
                      label="公司名称"
                      idKey="comId"
                      valueKey="comName"
                      showSearch={true}
                      disabled={this.isEdit}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="审批角色">
                  {getFieldDecorator('nodeCode', {initialValue: nodeCode, rules: [{ required: this.isAdd, message: '请选择审批角色!' }]})(
                    <Select
                      disabled={this.isEdit}
                      onChange={this.handleApproveChange}
                      allowClear={true}
                    >
                      {
                        this.props.approveNodeList.map(node =>
                          <Option value={node.nodeCode}>{node.nodeName}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="立项BU">
                  {
                    getFieldDecorator('sbuNo',{
                      initialValue: [sbuNo, sbuName], rules: [{ required: this.isAdd && this.state.subNoEdit, message: '请选择立项BU!' }]
                    })(
                      <SelectSbu
                        disabled={!this.state.subNoEdit}
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="立项区域">
                  {getFieldDecorator('projetRegion', {initialValue: projectRegion, rules: [{ required: this.isAdd && this.state.regionEdit, message: '请选择立项区域!' }]})(
                    <TreeSelect
                      disabled={!this.state.regionEdit}
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
            </Row>
            <Row gutter={30}>
              {
                !this.isEdit ?
                  <Col span={24} key={1}>
                    <FormItem {...formItemLayout1} label="审批角色对应人">
                      {getFieldDecorator('personIds', {initialValue: [], rules: [{ required: !this.isEdit, message: '请选择审批角色对应人!' }]})(
                        <ApproveSearch
                          url="/search/addressbook/staff"
                          columns={columns}
                          placeholder="审批角色对应人"
                          form={this.props.form}
                          onChange={this.handleChange}
                          setPersonIds={this.setPersonIds}
                        />
                      )}
                    </FormItem>
                  </Col> :
                  <Col span={22}>
                    <FormItem {...formItemLayout1} label="审批角色对应人">
                      <Table
                        bordered
                        size="small"
                        columns={this.columns}
                        dataSource={personInfos}
                        pagination={false}
                      />
                    </FormItem>
                  </Col>
              }
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(ApproveConfigAdd)
