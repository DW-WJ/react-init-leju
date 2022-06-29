import { addAirticlList } from '@/services/ant-design-pro/airtice';
import { message } from 'antd';

import type { Effect } from 'umi';
type MType = {
  namespace: string;
  state: {};
  reducers: {};
  effects: {
    saveAirticlList: Effect;
  };
};
const M: MType = {
  namespace: 'airticleEdit',
  state: {},
  reducers: {},
  effects: {
    *saveAirticlList({ payload: { submitform, callback } }, { call }) {
      const { success, message: errMsg } = yield call(addAirticlList, submitform);
      if (success) {
        message.success('保存成功！');
        callback();
      } else {
        message.success(errMsg);
      }
    },
  },
};
export default M;
