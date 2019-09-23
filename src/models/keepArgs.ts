/*
 * @Author: Terryzh
 * @Date: 2019-08-12 10:35:26
 * @LastEditors: Terryzh
 * @LastEditTime: 2019-08-20 17:37:38
 * @Description: 添加描述
 */
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { formatPayload } from '@/utils/utils';

export interface ArgsModelState {
  Args: Record<string, string | number | null | undefined>;
  pagenation: {
    current: number;
    size: number;
  };
}
export interface ArgsModelType {
  namespace: 'keepArgs';
  state: ArgsModelState;
  effects: {};
  reducers: {
    saveArgsParams: Reducer<ArgsModelState>;
    savePagenation: Reducer<ArgsModelState>;
    resetAll: Reducer<ArgsModelState>;
  };
}

const Model: ArgsModelType = {
  namespace: 'keepArgs',
  state: {
    Args: {},
    pagenation: {
      current: 1,
      size: 10,
    },
  },
  effects: {},
  reducers: {
    saveArgsParams(state = { Args: {}, pagenation: { current: 1, size: 10 } }, action) {
      return {
        ...state,
        Args: action.payload ? formatPayload(action.payload) : {},
      };
    },
    savePagenation(state = { Args: {}, pagenation: { current: 1, size: 10 } }, action: any) {
      return {
        ...state,
        pagenation: action.payload,
      };
    },
    resetAll() {
      return { Args: {}, pagenation: { current: 1, size: 10 } };
    },
  },
};
export default Model;
