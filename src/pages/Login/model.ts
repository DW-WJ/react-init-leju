// import { doLogin as doLoginApi } from '@/services/ant-design-pro/api';
import { login as doLoginApi } from '@/services/ant-design-pro/api';
import { saveUserInfo, setToken } from '@/utils/myAuth';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';
// 通过
export type TUserInfo = {
  usarname: string;
  password: string;
  nickname: string;
  icon: string;
  personalizedSignature?: null;
};
export type MStateType = {
  foo: string;
  userInfo: TUserInfo | {};
};
export type MType = {
  namespace: string;
  state: MStateType;
  reducers: {
    initUserInfo: Reducer;
  };
  effects: {
    doLogin: Effect;
  };
};
const M = {
  namespace: 'myLogin',
  //state通过reducers修改
  state: {
    userInfo: {},
  },
  //用于修改state
  reducers: {
    initUserInfo(state: any, { payload }: any) {
      const { userInfo } = payload;
      return {
        ...state,
        userInfo,
      };
    },
  },
  effects: {
    *doLogin({ payload }: any, { call, put }: any) {
      console.log('payload', payload);
      const { data, success, message: errMsg } = yield call(doLoginApi, payload);
      console.log('success', success);
      if (success) {
        message.success('🎇 🎇 🎇 登录成功！');
        yield put({
          type: 'initUserInfo',
          payload: data,
        });
        const myData = data as { token: string; userInfo: TUserInfo };
        const { token, userInfo } = myData;
        setToken(token);
        saveUserInfo(userInfo);
        window.location.href = '/';
      } else {
        message.error(errMsg);
      }

      // doLoginApi(payload)
    },
  },
};
export default M;
