/*
 * @Author: yangdan
 * @Date: 2019-09-16 10:04:38
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-18 09:56:45
 * @Description: 添加描述
 */
import request from '@/utils/request';
import { TableListParams, FromAddParams } from './data.d';

export async function queryRule(data: TableListParams) {
  return request('/userInfo/queryUserInfo', {
    method: 'post',
    data,
  });
}

