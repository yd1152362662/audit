/*
 * @Author: yangdan
 * @Date: 2019-09-06 16:51:54
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-17 10:19:46
 * @Description: 添加描述
 */
import request from '@/utils/request';
import { LoginParams } from './data.d';

export async function accountLoginRule(data: LoginParams) {
  return request('/admin/login', {
    method: 'POST',
    data,
  });
}


export async function accountLoginCode() {
  return request('/getCaptcha', {
    method: 'POST',
  });
}
