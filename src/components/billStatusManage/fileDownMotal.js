/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table, message, Select } from 'antd'

class FileDownModal extends React.Component {
  state = {
    selectedRowKeys: '',
    selectedRows: '',
    disableDis: true,
    showNewApplayDis: false,
  }
  fileDown = (fileId, fileName) => {
    if(fileId=='' || fileName ==''){
      message.error('文件ID或文件名不能为空！')
      return
    }
    this.props.fileDown(fileId, fileName)
  }
  render() {
    let dataSource = this.props.data
    return (
      <div>
        <Modal
          width={500}
          height={500}
          title="发票文本"
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onCancel}
          footer={null}
        >
          <div style={{textAlign: 'center',marginBottom:'20px'}}>
            <span style={{display:'inline-block'}}>发票文本：</span>
            <div style={{display:'inline-block'}}><a href="javascript:;" onClick={()=>this.fileDown(dataSource[0],dataSource[1])}>{dataSource[0]}</a></div>
          </div>
        </Modal>
      </div>
    )
  }
}
FileDownModal.propTypes = {
  closeClaim: PropTypes.func,
  applyReject: PropTypes.func,
  applyComfirm: PropTypes.func,
  infoVisitable: PropTypes.bool,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}

export default FileDownModal
