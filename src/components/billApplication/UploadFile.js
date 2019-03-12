import React from 'react'
import { Form, Button, Icon, Upload, Row, Col } from 'antd'
import {message} from "antd/lib/index";
import requestJsonFetch from "../../http/requestJsonFecth";
const FormItem = Form.Item
const formItemLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
class UploadFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: {},
      fileList: [],
      fileId: '',
      uploadFile: false,
    }
  }

  beforeUpload = (file) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('上传文件大小必须小于20MB!');
      return false
    }
    if(file.name.length > 40) {
      message.error('上传的文件名必须小于40个中文')
      return false
    }
    this.setState({
      file,
    })
  }

  customRequest = (file) => {
    this.setState({
      uploadFile: true
    })
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream;charset=UTF-8',
      },
      body: file.file,
    }
    requestJsonFetch(`/arc/file/upload/${this.state.file.name}`, option, this.handleCallback)
  }

  handleCallback = (response) => {
    if(response.resultCode === '000000') {
      const { file, fileList } = this.state
      message.success(`${file.name} 上传成功`);
      this.setState({
        fileId: response.data,
        fileList: [...fileList, {
          uid: new Date().getTime(),
          name: file.name,
          status: 'done',
          response: '', // custom error message to show
          url: '',
        }],
      })
      this.props.setFileInfo(response.data, file.name)
    } else {
      this.setState({
        uploadFile: false
      })
      message.error(`${this.state.file.name} 上传失败`);
    }
  }

  handleFileChange = (info) => {
    if (info.file.status !== 'uploading') {
     
    }
    if (info.file.status === 'removed') {
      this.setState({
        fileList: info.fileList,
        fileId: '',
        file: {},
        uploadFile: false
      })
      this.props.form.setFieldsValue({
        file: '',
      })
      this.props.setFileInfo('', '')
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { isRequired, fileName, fileId } = this.props
    const props = {
      action: `${process.env.REACT_APP_GATEWAY}v1.0.0/arc/file/upload/${this.state.file.name}`,
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      showUploadList: { showPreviewIcon: true, showRemoveIcon: true },
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest,
      onChange: this.handleFileChange,
    };
    return (
      <Row gutter={40}>
        <Col span={14}>
          <FormItem {...formItemLayout1} label="附件">
            {
              fileId ?
                <a href="javascript:void(0)" onClick={() => this.props.fileDown({objectId: fileId, objectName: fileName})}>{fileName}</a>
                :
              getFieldDecorator('file', {initialValue: fileName, rules: [{ required: isRequired, message: '请上传附件' }] })(
                <div style={{position: 'relative'}}>
                  <Upload {...props} fileList={this.state.fileList}>
                    <Button disabled={this.state.uploadFile}>
                      <Icon type="upload" />点击上传
                    </Button>
                  </Upload>
                  <span className="file-tip">说明：未大签项目、其他开票需要上传合同附件</span>
                </div>
              )
            }
          </FormItem>
        </Col>
      </Row>
    )
  }
}

export default UploadFile
