/*
 * @Author: yangdan
 * @Date: 2019-09-06 17:32:38
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-09 17:44:34
 * @Description: 添加描述
 */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import { queryRule } from '../pages/manageUserAudit/manage-car-audit/service';

import { TableListData, ArgStatus } from '../pages/manageUserAudit/manage-car-audit/data.d';

export interface StateType {
  data: TableListData;
  argStatus: ArgStatus;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    saveArgStatus: Reducer<StateType>;
  };
}

const initialState: StateType = {
  data: {
    list: [],
    pagination: {},
  },
  argStatus: {
    current: 1,
    size: 10,
  },
};
const Model: ModelType = {
  namespace: 'globalCarTableList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    argStatus: {
      current: 1,
      size: 10,
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const queryCondition = yield select((state: any) => ({
        ...state.keepArgs.Args,
        ...state.keepArgs.pagenation,
      }));
      const response = yield call(queryRule, queryCondition);
      const argPayload = {
        list: response.result.records,
        pagination: response.pagination
      };
      yield put({
        type: 'save',
        payload: argPayload,
      });
    },
  },

  reducers: {
    save(state = initialState, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveArgStatus(state = initialState, action) {
      return {
        ...state,
        argStatus: action.payload,
      };
    },
  },
};

export default Model;
