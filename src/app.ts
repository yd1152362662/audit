/*
 * @Author: Terryzh
 * @Date: 2019-08-20 15:57:51
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-17 10:30:13
 * @Description: 添加描述
 */
import { notification } from 'antd';

export const dva = {
  config: {
    onError(e) {
      console.log('e', e)
      e.preventDefault();
      notification.error({
        message: '出现了未知错误!',
        description: '这项操作出现了未知的错误,建议您刷新页面,重新操作。',
      });
    },
  },
};
