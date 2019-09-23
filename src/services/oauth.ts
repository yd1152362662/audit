import request from '@/utils/request';

/**
 * @function 登出
 */
export async function accountLoginOutRule() {
  return request('/oauth/logout', {
    method: 'POST',
  });
}
