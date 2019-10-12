/*
 * @Author: Terryzh
 * @Date: 2019-08-10 18:42:50
 * @LastEditors: yangdan
 * @LastEditTime: 2019-10-12 17:25:00
 * @Description: 添加描述
 */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import { router } from 'umi';
import { accountLoginRule ,accountLoginCode } from './service';
import { message } from 'antd';
export interface UserStateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  url?:string;
}

export interface UserModelType {
  namespace: string;
  state: UserStateType;
  effects: {
    login: Effect;
    code:Effect
  };
  reducers: {
    changeLoginStatus: Reducer<UserStateType>;
  };
}

const UserModel: UserModelType = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      // console.log('accountLoginRule', accountLoginRule)
      const response = yield call(accountLoginRule, payload);
      // ?登录成功的跳转
      console.log(response)
      if (response.success) {
        // ?保存token
        window.localStorage.setItem('token', response.token);
        // console.log('denglu')
        // TODO 页面跳转
        router.replace('/');
      }
      else {
        message.error(response.message);
      }
    },
    *code(_,{call}){
      const response = yield call(accountLoginCode);
      console.log(response)
    }
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

export default UserModel;
