import request from '@/utils/request';

/**
 * @function 流向管控的详情接口
 */
export async function getWaybillTransportDetailRule(data: { waybillNo: string }) {
  return request('/waybillThird/getWaybillTransportDetail', {
    method: 'POST',
    data: !data ? '' : data,
  });
}
