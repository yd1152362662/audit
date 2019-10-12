/*
 * @Author: yangdan
 * @Date: 2019-08-10 18:42:50
 * @LastEditors: yangdan
 * @LastEditTime: 2019-10-11 18:15:33
 * @Description: 添加描述
 */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import router from 'umi/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): void => {
  const { response } = error;
  console.log('errorHandler', error);
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
};

/**
 * 配置request请求时的默认参数
 */
// ?处理登录授权过期的逻辑
if (window.localStorage.getItem('token') === null) router.replace('/user/login');
const request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'same-origin', // 默认请求是否带上cookie
  // mode: 'no-cors',
  credentials: 'include',
  // 官网打包
  prefix: 'http://audit.fantudl.com:80/api',
  // 本地运行
  // prefix: '/api',
});

// ?处理登录前后header的拦截器

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  console.log(url, options)
  return {
    url,
    options: {
      ...options,
      headers: {
        token: window.localStorage.getItem('token') || '',// 统一的headers
      },
    },
  };
});


// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  // 获取后端返回msg和code
  const { code, msg } = await response.clone().json();
  console.log('msg', msg)
  if (response.status === 200) {
    if (code === 200 && !/query|get/g.test(response.url)) message.success(msg);
    else if (typeof code === 'number' && code.toString().length >= 4) message.warning(msg);
    else if (typeof code === 'number' && code === 401) message.warning(msg);
    else if (typeof code === 'number' && code === 403) {
      message.error("Token 失效,将在2秒后跳转到登录页面");
      setTimeout(()=>{router.replace('/user/login')},2*1000)
    }
  } else message.error(msg);

  return response;
});

// console.log('haha---->', process.env.apiUrl);
export default request;
