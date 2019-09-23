import request from '@/utils/request';

export async function menuRule() {
  return request('/oauth/getUserMenus', {
    method: 'POST',
  });
}
