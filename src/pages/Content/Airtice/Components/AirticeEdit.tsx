import { Button, Form, Input, message, Modal, Switch, Upload } from 'antd';
import React, { useState } from 'react';
// 引入编辑器组件
import type { EditorState } from 'braft-editor';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import { getToken } from '@/utils/myAuth';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import type { Dispatch } from 'umi';
import { connect } from 'umi';

type PropsType = {
  isModalVisible: boolean;
  setIsModalVisible: any;
  dispatch: Dispatch;
  refrushList: any;
};
const namespace = 'airticleEdit';
const AirticeEdit: React.FC<PropsType> = (props) => {
  //   const [isModalVisible, setIsModalVisible] = useState(false);
  const { isModalVisible, setIsModalVisible, dispatch, refrushList } = props;

  //   const showModal = () => {
  //     setIsModalVisible(true);
  //   };
  const [editorState, seteditorState] = useState<EditorState>(null);
  const [coverImg, setCoverImg] = useState<string>('');
  const [form] = Form.useForm();
  const [ImgList, setImgList] = useState<UploadFile[]>([]);
  const callback = () => {
    console.log('回调了。。。');
    // 设置表单为空
    // form.setFieldsValue({
    //   isShow:true
    // })
    // 清空表单
    form.resetFields();
    // setCoverImg('');
    setImgList([]);
    // seteditorState('')
    // ContentUtils.clear(editorState);
    seteditorState(editorState && ContentUtils.clear(editorState));
    setIsModalVisible(false);
    refrushList();
  };
  const handleOk = () => {
    // console.log('确定', value);
    form
      .validateFields()
      .then(() => {
        console.log('ok');
        const formValues = form.getFieldsValue();
        const editorCotentValue = editorState.toHTML();
        const submitform = {
          ...formValues,
          isShow: formValues.isShow ? 1 : 0,
          coverImg,
          content1: editorCotentValue,
          content2: editorCotentValue,
          editorType: 0,
        };
        console.log('submitform', submitform);
        dispatch({
          type: `${namespace}/saveAirticlList`,
          payload: {
            submitform,
            callback,
          },
        });
        setIsModalVisible(false);
      })
      .catch(() => {
        message.error('请注意表单验证');
        console.log('ssss');
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    console.log('取消');
  };
  const onIsShowSwithChange = () => {};

  const handleEditorChange = (v: EditorState) => {
    // this.setState({ editorState })
    // console.log('v', v.toHTML());
    seteditorState(v);
  };
  const submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    // const htmlContent = this.state.editorState.toHTML();
    // const result = await saveEditorContent(htmlContent);
  };
  const uploadProps: UploadProps = {
    name: 'file',
    action: '/lejuAdmin/material/uploadFileOss',
    headers: {
      authorization: 'authorization-text',
      token: getToken() || '',
    },
    listType: 'picture',
    maxCount: 1,
    onChange({ file, fileList: fList }) {
      if (file.status == 'uploading') {
        console.log('uploading', file, fList);
      }
      if (file.status === 'done') {
        message.success(`${file.name} file uploaded successfully`);
        console.log('done', file, fList);
        const { response } = file;
        const { success, message: errMsg, data } = response;
        if (success) {
          const { fileUrl } = data;
          setCoverImg(fileUrl);
        } else {
          message.error(errMsg);
        }
      } else if (file.status === 'error') {
        message.error(`${file.name} file upload failed.`);
        console.log('error', file, fList);
      }
      setImgList(fList);
    },
    onRemove() {
      setCoverImg('');
    },
  };

  return (
    <div>
      <Modal title="新增文章" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          initialValues={{ isShow: true }}
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="文章标题"
            name="title"
            rules={[{ required: true, message: '请输入文章' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="作者" name="author" rules={[{ required: true, message: '请输入作者' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="文章概要"
            name="summary"
            rules={[{ required: true, message: '请输入文章概要' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="封面图片">
            <Upload {...uploadProps} fileList={ImgList}>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="是否显示" name="isShow" valuePropName="checked">
            <Switch defaultChecked onChange={onIsShowSwithChange} />
          </Form.Item>
          <Form.Item label="文章内容"></Form.Item>
          <BraftEditor
            style={{ border: '1px solid #e5e5e5' }}
            value={editorState}
            onChange={handleEditorChange}
            onSave={submitContent}
          />
        </Form>
      </Modal>
    </div>
  );
};
const mapStateToProps = () => ({});
export default connect(mapStateToProps)(AirticeEdit);