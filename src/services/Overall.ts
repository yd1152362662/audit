
import request from '@/utils/request';

// 获取用户信息信息详情
export async function queryUser(data: any) {
  return request('/userInfo/get', {
    method: 'post',
    data,
  });
}

// 获取车辆信息信息详情
export async function queryCar(data: any) {
  return request('/carInfo/get', {
    method: 'post',
    data,
  });
}

//用户审核接口
export async function auditUser(data: any) {
  return request('/userInfo/audit', {
    method: 'post',
    data,
  });
}

// 车辆审核接口
export async function auditCar(data: any) {
  return request('/carInfo/audit', {
    method: 'post',
    data,
  });
}

// 获取历史信息信息详情
export async function queryHistory(data: any) {
  return request('/auditHistory/get', {
    method: 'post',
    data,
  });
}




