import React from 'react';
import { Form, Input, Button } from 'antd';
import Footer from '@/components/Footer';
import { connect } from 'umi';
import styles from './index.less';
import type { Dispatch } from 'umi';
import type { TUserInfo, MStateType } from './model';
import type { TLogInParams } from '@/services/ant-design-pro/api';
const namespace = 'myLogin';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 24 },
};
type TProps = {
  dispatch: Dispatch;
  userInfo: TUserInfo;
};
const Login: React.FC<TProps> = (props) => {
  const { dispatch, userInfo } = props;
  const onFinish = (values: TLogInParams) => {
    console.log('Success:', values);
    console.log('userInfo:', userInfo);
    dispatch({
      type: 'myLogin/doLogin',
      payload: { ...values },
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Form
          {...layout}
          className={styles.main}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="账户"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout} wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登录React系统
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </div>
  );
};
const mapStateToProps = (state: MStateType) => {
  return {
    userInfo: state[namespace].userInfo,
  };
};
export default connect(mapStateToProps)(Login);
