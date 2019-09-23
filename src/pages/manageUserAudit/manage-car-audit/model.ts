import { Reducer } from 'redux';
import { Effect } from 'dva';
import {  queryRule} from './service';

import { TableListData, ArgStatus } from './data.d';

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
  namespace: 'carTableList',
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
