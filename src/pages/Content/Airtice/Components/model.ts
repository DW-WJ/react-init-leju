import {
  addAirticlList,
  getAirticlList,
  updateAirticlList,
} from '@/services/ant-design-pro/airtice';
import { message } from 'antd';
// import type { ArticleType } from '../model';

import type { ArticleType, Effect, Reducer } from 'umi';
export type MStateType = {
  airticle: ArticleType;
};
type MType = {
  namespace: string;
  state: MStateType;
  reducers: {
    setAirticle: Reducer;
    setdata: Reducer;
  };
  effects: {
    saveAirticlList: Effect;
    findAirticle: Effect;
  };
};
const M: MType = {
  namespace: 'airticleEdit',
  state: {
    airticle: {
      author: '',
      title: '',
    },
  },
  reducers: {
    setAirticle(state, { pyload }) {
      const { airticle } = pyload;
      console.log(airticle, 'airticle');
      return {
        ...state,
        airticle,
      };
    },
    setdata(state, { payload }) {
      console.log(state, payload);
      const airticle = payload;
      return {
        ...state,
        airticle,
      };
    },
  },
  effects: {
    *saveAirticlList({ payload: { submitform, callback } }, { call }) {
      const api = submitform.id ? updateAirticlList : addAirticlList;
      const { success, message: errMsg } = yield call(api, submitform);
      if (success) {
        message.success(submitform.id ? '修改成功' : '保存成功！');
        callback();
      } else {
        message.success(errMsg);
      }
    },
    *findAirticle({ payload: { id } }, { call, put }) {
      const { success, message: errMsg, data } = yield call(getAirticlList, id);
      if (success) {
        const { productArticle } = data;
        console.log('data', data);
        console.log('productArticle', productArticle);
        // yield put({
        //   type: 'setAirticle',
        //   payload: productArticle,
        // });
        yield put({
          type: 'setdata',
          payload: productArticle,
        });

        message.success('查询成功！');
      } else {
        message.success(errMsg);
      }
    },
  },
};
export default M;
