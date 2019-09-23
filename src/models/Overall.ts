
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryUser, queryCar, auditUser, auditCar,queryHistory} from '@/services/Overall';
export interface ModelState {
  data: any;
}

export interface UtilSelectOptsModelType {
  namespace: 'Overall';
  state: ModelState;
  effects: {
    fetchUser: Effect;
    fetchCar: Effect;
    userAudit: Effect;
    carAudit: Effect;
    fetchHistory:Effect;
  };
  reducers: {
    // saveCompOpts: Reducer<ModelState>;
  };
}

const utilSelectOptsModel: UtilSelectOptsModelType = {
  namespace: 'Overall',
  state: {

  },
  effects: {
    /**
     * @function 查询用户详情
     */
    *fetchUser({payload,callback}, { call, put }) {
      const response = yield call(queryUser,payload);
      // console.log('response', response)
      return response
    },
    /**
     * @function 查询车辆详情
     */
    *fetchCar({ payload }, { call, put }) {
      const response = yield call(queryCar, payload);
      // console.log('response', response)
      return response
    },
    /**
     * @function 用户审核
     */
    *userAudit({ payload,callback }, { call, put }) {
      const response = yield call(auditUser,payload);
      // console.log('response',response)
      if (callback && typeof callback === 'function') {
        callback(response);
      }

    },
    /**
     * @function 车辆审核
     */
    *carAudit({payload,callback}, { call, put }) {
      const response = yield call(auditCar,payload);
      // console.log('response',response)
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    /**
     * @function 查询历史记录详情
     */
    *fetchHistory({payload,callback}, { call, put }) {
      const response = yield call(queryHistory,payload);
      // console.log('response', response)
      return response
    },
  },

  reducers: {

  },
};

export default utilSelectOptsModel;
