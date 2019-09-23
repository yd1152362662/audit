/*
 * @Author: yangdan
 * @Date: 2019-09-06 17:32:38
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-09 17:44:34
 * @Description: 添加描述
 */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import {  queryRule} from './service';

import { TableListData, ArgStatus } from './data.d';

export interface StateType {
  dataUser: TableListData;
  dataCar: TableListData;
  argStatus: ArgStatus;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchUser: Effect;
    fetchCar: Effect;
  };
  reducers: {
    saveUser: Reducer<StateType>;
    saveCar: Reducer<StateType>;
    saveArgStatus: Reducer<StateType>;
  };
}

const initialState: StateType = {
  dataUser: {
    list: [],
    pagination: {},
  },
  dataCar: {
    list: [],
    pagination: {},
  },
  argStatus: {
    current: 1,
    size: 10,
  },
};
const Model: ModelType = {
  namespace: 'reaordTableList',
  state: {
    dataUser: {
      list: [],
      pagination: {},
    },
    dataCar: {
      list: [],
      pagination: {},
    },
    argStatus: {
      current: 1,
      size: 10,
    },
  },

  effects: {
    *fetchUser({ payload }, { call, put, select }) {
      const queryCondition = yield select((state: any) => ({
        ...state.keepArgs.Args,
        ...state.keepArgs.pagenation,
      }));
      const response = yield call(queryRule, queryCondition);
      // console.log('responserecord', response)
      const argPayload = {
        list: response.result.records,
        pagination: response.pagination
      };
      yield put({
        type: 'saveUser',
        payload: argPayload,
      });
    },
    *fetchCar({ payload }, { call, put, select }) {
      const queryCondition = yield select((state: any) => ({
        ...state.keepArgs.Args,
        ...state.keepArgs.pagenation,
      }));
      const response = yield call(queryRule, queryCondition);
      // console.log('responserecord', response)
      const argPayload = {
        list: response.result.records,
        pagination: response.pagination
      };
      yield put({
        type: 'saveCar',
        payload: argPayload,
      });
    }

  },

  reducers: {
    saveUser(state = initialState, action) {
      return {
        ...state,
        dataUser: action.payload,
      };
    },
    saveCar(state = initialState, action) {
      return {
        ...state,
        dataCar: action.payload,
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
