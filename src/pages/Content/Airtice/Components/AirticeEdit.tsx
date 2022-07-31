import { Button, Form, Input, message, Modal, Switch, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
// 引入编辑器组件
import type { EditorState } from 'braft-editor';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import { getToken } from '@/utils/myAuth';
import { UploadOutlined } from '@ant-design/icons';
// import type { ConnectState } from '';
// import type { ConnectState } from '@models/common';
import { PageLoading } from '@ant-design/pro-layout';
import type { UploadProps } from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import 'braft-editor/dist/index.css';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { ArticleType } from '../model';
import type { MStateType } from './model';
// import { ContentUtils } from 'braft-utils';
// const { ContentUtils } = require('braft-utils');

type PropsType = {
  isModalVisible: boolean;
  setIsModalVisible: any;
  dispatch: Dispatch;
  refrushList: any;
  id: string;
  airticle: ArticleType;
  loading: boolean;
};
const namespace = 'airticleEdit';
// const naamespaceedit = 'airtice';
type CoverImgPropsType = {
  action: string;
  token: string;
  coverImg?: string;
  onChange: () => any;
};
const CoverImgUpload: React.FC<CoverImgPropsType> = (props) => {
  const [coverImg, setCoverImg] = useState<string>('');
  const [ImgList, setImgList] = useState<UploadFile[]>([]);
  const { action, token } = props;

  const uploadProps: UploadProps = {
    name: 'file',
    action: action,
    headers: {
      authorization: 'authorization-text',
      token: token || '',
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
    <Upload {...uploadProps} fileList={ImgList}>
      <Button icon={<UploadOutlined />}>点击上传</Button>
    </Upload>
  );
};
const AirticeEdit: React.FC<PropsType> = (props) => {
  //   const [isModalVisible, setIsModalVisible] = useState(false);
  const { isModalVisible, setIsModalVisible, dispatch, refrushList, id, airticle, loading } = props;

  //   const showModal = () => {
  //     setIsModalVisible(true);
  //   };
  const [editorState, seteditorState] = useState<EditorState>(null);
  const [coverImg, setCoverImg] = useState<string>('');
  const [form] = Form.useForm();
  const [ImgList, setImgList] = useState<UploadFile[]>([]);
  useEffect(() => {
    if (id) {
      dispatch({
        type: `${namespace}/findAirticle`,
        payload: { id },
      });
    }
  }, [id]);
  useEffect(() => {
    // const { id } = airticle;
    if (airticle.id) {
      const formData = {
        ...airticle,
        isShow: airticle.isShow === 1,
      };
      console.log('formData', formData);
      form.setFieldsValue({
        ...formData,
      });
      seteditorState(BraftEditor.createEditorState(airticle.content1));
      const myurl: any = airticle.coverImg;
      const fileName: string = myurl.substr(myurl.lastIndexOf('/') + 1, myurl.length - 1);
      const file: UploadFile = { uid: airticle.id, name: fileName, url: airticle.coverImg };
      setImgList([file]);
      setCoverImg(myurl);
    }
  }, [airticle]);
  const callback = () => {
    console.log('回调了。。。');
    // 设置表单为空
    // form.setFieldsValue({
    //   isShow:true
    // })
    // 清空表单
    doClearForm();
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
        if (id) {
          submitform.id = id;
        }
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
    doClearForm();
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
  const doClearForm = () => {
    // seteditorState(editorState && ContentUtils.clear(editorState));
    seteditorState(BraftEditor.createEditorState(null));
    form.resetFields();
    // setCoverImg('');
    setImgList([]);
    // seteditorState('')
    // ContentUtils.clear(editorState);
    setIsModalVisible(false);
    refrushList();
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
      <Modal
        title={id ? '编辑文章' : '新增文章'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {loading ? (
          <PageLoading />
        ) : (
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

            <Form.Item
              label="作者"
              name="author"
              rules={[{ required: true, message: '请输入作者' }]}
            >
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
        )}
      </Modal>
    </div>
  );
};
type StateType = {
  [namespace]: MStateType;
};
const mapStateToProps = (state: StateType) => {
  console.log('state', state);
  return {
    airticle: state[namespace].airticle,
    loading: state['loading'].effects['airticleEdit/findAirticle'] as boolean,
  };
};
export default connect(mapStateToProps)(AirticeEdit);
