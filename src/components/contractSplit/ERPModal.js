/**
 * Created by liangshuang on 17/12/12.
 */
/**
 * Created by liangshuang on 17/12/8.
 */
import React from 'react'
import ErpFrom from './ERPWithFrom'
import { constructSplitSearchColumns } from '../statementSearch/statementColumns'
import { Table,Modal,Button } from 'antd'

class ERPModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  getTableWidth = (colum)=> {
    let width = 0
    colum.map((item,idnex)=>{
      width += parseFloat(item.width)
    })
    return width
  }
  // 查询接口
  queryParms = (param) => {
    this.props.queryParms(param)
  }
  // 传送ERP接口
  sendERP = (param) => {
    this.props.sendERPQuery(param)
  }
  render() {
    return (
      <div style={{width:'100%',minHeight:'500px'}}>
        <Modal
          width={1024}
          visible={true}
          onOk={this.props.closeERPModal}
          onCancel={this.props.closeERPModal}
          title=""
          footer={null}
        >
          <ErpFrom queryParms={this.queryParms}/>
          <Button type="primary" onClick={this.sendERP}>传送ERP</Button>
          <br />
          <Table
            rowKey="contractId"
            pagination={false}
            bordered
            columns={constructSplitSearchColumns}
            size="middle"
            scroll={{ x: this.getTableWidth(constructSplitSearchColumns) }}
            /*loading={this.state.loading}*/
            /*dataSource={this.props.contractSplitDara.getContractList.result}*/
          />
        </Modal>

      </div>
    )
  }
}

export default ERPModal
