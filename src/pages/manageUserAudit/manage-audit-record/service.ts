/*
 * @Author: yangdan
 * @Date: 2019-09-16 10:04:38
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-16 10:04:38
 * @Description: 添加描述
 */
import request from '@/utils/request';
import { TableListParams} from './data.d';

export async function queryRule(data: TableListParams) {
  return request('/auditHistory/queryList', {
    method: 'post',
    data,
  });
}


