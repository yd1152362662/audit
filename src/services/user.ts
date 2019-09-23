import re from 'umi-request';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/oauth/getAuthUserInfo', {
    method: 'POST',
  });
}

export async function queryNotices() {
  return re('/api/notices');
}

export async function queryCurrentSiteTitle() {
  return request('/userConfig/getSiteTitle', {
    method: 'POST',
  });
}
