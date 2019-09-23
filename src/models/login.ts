/*
 * @Author: Terryzh
 * @Date: 2019-08-20 11:21:31
 * @LastEditors: Terryzh
 * @LastEditTime: 2019-08-26 09:52:14
 * @Description: 登出逻辑
 */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import { router } from 'umi';
import { accountLoginOutRule } from '@/services/oauth';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *logout(_, { put, call }) {
      const response = yield call(accountLoginOutRule);
      if (response.code === 200) {
        window.localStorage.removeItem('mark');
      }
      // redirect
      if (window.location.pathname !== '/user/login') {
        router.replace('/user/login');
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
