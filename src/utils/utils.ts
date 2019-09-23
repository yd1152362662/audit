/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// 处理payload的data结构
const formatPayload = (
  payload: Record<string, string | number | null | undefined>,
): Record<string, string | number | null | undefined> =>
  Object.keys(payload)
    .map(key =>
      Object.assign(
        {},
        payload[key] !== '' && payload[key] !== null ? { [key]: payload[key] } : undefined,
      ),
    )
    .reduce((pV, cV) => Object.assign(pV, cV));

export { isAntDesignProOrDev, isAntDesignPro, isUrl, formatPayload };