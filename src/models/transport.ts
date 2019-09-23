/*
 * @Author: Terryzh
 * @Date: 2019-08-12 10:35:26
 * @LastEditors: Terryzh
 * @LastEditTime: 2019-08-21 14:47:37
 * @Description: 流向管理的model层
 */
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getWaybillTransportDetailRule } from '@/services/trans';
import { FormatListParams, WayDetailDataState, ControlEvent } from './transport.d';

// model 中state的值
export interface TransWayState extends FormatListParams, WayDetailDataState {}
export interface TransWayType {
  namespace: 'TransManageControl';
  state: TransWayState;
  effects: {
    fetchWaybillTransportDetail: Effect;
  };
  reducers: {
    saveFormatList: Reducer<TransWayState>;
  };
}

export const initialData: TransWayState = {
  controlEventList: [],
  pointList: [],
  enterMarkerTimeList: [],
  elecFenceInfo: { points: [] },
  xAxisList: [],
  yWeightList: [],
  ySpeedList: [],
  yAreaMaskList: [],
  eventPointList: [{ name: '', symbolSize: 22, coord: ['', ''] }],
  beginPoint: {
    lng: 0,
    lat: 0,
  },
  endPoint: {
    lng: 0,
    lat: 0,
  },
};

const Model: TransWayType = {
  namespace: 'TransManageControl',
  state: initialData,
  effects: {
    *fetchWaybillTransportDetail({ payload }, { call, put }) {
      const response = yield call(getWaybillTransportDetailRule, payload);
      if (response.code === 1000) {
        yield put({
          type: 'saveFormatList',
          payload: initialData,
        });
        return initialData;
      }
      yield put({
        type: 'saveFormatList',
        payload: response.result,
      });
      return response.result;
    },
  },
  reducers: {
    saveFormatList(state = initialData, action): TransWayState {
      const xAxisList = action.payload.pointList.map(({ strTime }: { strTime: string }) => strTime);
      const yWeightList = action.payload.pointList.map(({ weight }: { weight: number }) => weight);
      const ySpeedList = action.payload.pointList.map(({ speed }: { speed: number }) => speed);
      const yAreaMaskList = action.payload.enterMarkerTimeList.map(
        ({ enterTime, leaveTime }: { enterTime: string; leaveTime: string }) => {
          const argParams = [
            {
              xAxis: enterTime,
              itemStyle: {
                color: 'rgba(255, 0, 0, 0.25)',
              },
            },
            {
              xAxis: leaveTime,
              itemStyle: {
                color: 'rgba(255, 0, 0, 0.25)',
              },
            },
          ];
          return argParams;
        },
      );
      const eventPointList = action.payload.controlEventList.map(
        ({ endIndex, endTime, note }: ControlEvent) => ({
          name: note,
          symbolSize: 22,
          coord: [endTime, yWeightList[endIndex]],
        }),
      );
      return {
        ...state,
        controlEventList: action.payload.controlEventList,
        pointList: action.payload.pointList,
        enterMarkerTimeList: action.payload.enterMarkerTimeList,
        elecFenceInfo: action.payload.elecFenceInfo,
        xAxisList,
        yWeightList,
        ySpeedList,
        yAreaMaskList,
        eventPointList,
        endPoint: action.payload.endPoint,
        beginPoint: action.payload.beginPoint,
      };
    },
  },
};
export default Model;
