/*
 * @Author: Terryzh
 * @Date: 2019-08-20 11:21:31
 * @LastEditors: Terryzh
 * @LastEditTime: 2019-08-26 10:17:57
 * @Description: 添加描述
 */
import { Effect } from 'dva';
import { Reducer } from 'redux';
import router from 'umi/router';
import { queryCurrent, query as queryUsers, queryCurrentSiteTitle } from '@/services/user';

export interface CurrentUser {
  id: number;
  realName: string;
  userName: string;
  userType: number;
  userTypeDesc: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  siteTitle?: string;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchCurrentSiteTitle: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveCurrentSiteTitle: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {
      id: 0,
      realName: '',
      userName: '',
      userType: 0,
      userTypeDesc: '',
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.result,
        });
      } else if (response.code === -1) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('Authorization');
        router.replace('/user/login');
      }
      const response2 = yield call(queryCurrentSiteTitle);
      if (response2.code === 200) {
        yield put({
          type: 'saveCurrentSiteTitle',
          payload: response2.result,
        });
      }
    },
    *fetchCurrentSiteTitle(_, { call, put }) {
      const response = yield call(queryCurrentSiteTitle);
      if (response.code === 200) {
        return response.result;
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveCurrentSiteTitle(state, action) {
      return {
        ...state,
        siteTitle: action.payload || '',
      };
    },
  },
};

export default UserModel;
