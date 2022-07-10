import {
  findAirticlList as findAirticlListApi,
  deleteAirticlList,
} from '@/services/ant-design-pro/airtice';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type MStateType = {
  airticeList: [];
  totalCount: number;
};

export type ArticleType = {
  author: string;
  collectCount?: number;
  content1?: string;
  content2?: string;
  coverImg?: string;
  createTime?: string;
  editorType?: number;
  id?: string;
  isShow?: number;
  modifyTime?: string;
  summary?: string;
  title: string;
  viewCount?: number;
  zanCount?: number;
};
type MType = {
  namespace: string;
  state: MStateType;
  effects: {
    findAirticlList: Effect;
    deteleAir: Effect;
  };
  reducers: {
    setAirticeList: Reducer;
  };
};
const M: MType = {
  namespace: 'airtice',
  state: {
    airticeList: [],
    totalCount: 0,
  },
  effects: {
    *findAirticlList({ payload }, { call, put }) {
      // 1,发送请求
      try {
        const { success, message: errMsg, data } = yield call(findAirticlListApi, payload);
        console.log('data', data);
        if (success) {
          const { rows, total } = data;
          yield put({
            type: 'setAirticeList',
            payload: {
              rows,
              total,
            },
          });
        } else {
          message.error(errMsg);
        }
        // 2，对结果进行处理
        console.log('res');
      } catch (error) {}
    },
    *deteleAir({ payload }, { call, put }) {
      const id = payload.id;
      const res = yield call(deleteAirticlList, id);
      console.log('res', res);
      if (res.success) {
        message.success('删除' + res.message);
      }
    },
  },
  reducers: {
    setAirticeList(state, { payload }) {
      const { rows, total } = payload;
      return {
        ...state,
        airticeList: rows,
        totalCount: total,
      };
    },
  },
};
export default M;
