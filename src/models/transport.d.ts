export interface ControlEvent {
  endIndex: number;
  endTime: string;
  eventType: string;
  note: string;
  startIndex: number;
  startTime: string;
}

export interface Point {
  angle: number;
  lat: number;
  lng: number;
  speed: number;
  strTime: string;
  timestamp: number;
  weight: number;
}

export interface EnterMarkerTime {
  enterTime: string;
  leaveTime: string;
}

export interface ElecFenceInfo {
  points: Point[];
  radius?: number;
  type?: 2;
}

export type AreaMaskParams = [
  {
    xAxis: string;
    itemStyle: {
      color: 'rgba(255, 0, 0, 0.25)';
    };
  },
  {
    xAxis: string;
    itemStyle: {
      color: 'rgba(255, 0, 0, 0.25)';
    };
  },
];

export interface EventPoint {
  name: string;
  symbolSize: number;
  coord: [string, string];
}

// 开始点和结束点的定义
export interface PointListParams {
  angle?: number;
  lat: number;
  lng: number;
  speed?: number;
  strTime?: string;
  timestamp?: number;
  weight?: number;
}

// 视图数据
export interface WayDetailDataState {
  controlEventList: ControlEvent[];
  pointList: Point[];
  enterMarkerTimeList: EnterMarkerTime[];
  elecFenceInfo: ElecFenceInfo;
  beginPoint: PointListParams;
  endPoint: PointListParams;
}

// 格式化echart和amap所需数据
export interface FormatListParams {
  xAxisList: string[];
  yWeightList: number[];
  ySpeedList: number[];
  yAreaMaskList: AreaMaskParams[];
  eventPointList: EventPoint[];
}

export interface TransParentParams {
  handleDrawerVisible: (...arg: any) => void;
  drawerVisible: boolean;
  record: any;
}
