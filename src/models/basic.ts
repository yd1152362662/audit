import { Effect } from 'dva';
import { Reducer } from 'redux';
import { menuRule } from '@/services/basic';

export interface BasicModelState {
  menuData: any;
}
export interface BasicModelType {
  namespace: 'Basic';
  state: BasicModelState;
  effects: {
    fetchMenu: Effect;
  };
  reducers: {
    saveMenu: Reducer<BasicModelState>;
  };
}

const BasicModel: BasicModelType = {
  namespace: 'Basic',
  state: {
    menuData: [],
  },
  effects: {
    *fetchMenu({ payload }, { call, put }) {
      const response = yield call(menuRule);
      yield put({
        type: 'saveMenu',
        payload: response.result,
      });
      return response.result;
    },
  },
  reducers: {
    saveMenu(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
  },
};
export default BasicModel;
