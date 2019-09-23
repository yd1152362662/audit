/*
 * @Author: Terryzh
 * @Date: 2019-08-12 10:35:26
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-16 14:20:04
 * @Description: 路由
 */
const dynamicRouters = [
  // 登录页
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
          {
            component: './exception/404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            name: 'welcome',
            icon: 'book',
            component: './Welcome',
          },
	        {
            path: '/system',
            icon: 'appstore',
            name: '审核',
            routes: [
              {
                name: '用户审核 ',
                icon: 'car',
                path: '/system/user',
                component: './manageUserAudit/manage-user-audit',
              },
			        {
                name: '车辆审核 ',
                icon: 'car',
                path: '/system/car',
                component: './manageUserAudit/manage-car-audit',
              },
              {
                name: '审核记录 ',
                icon: 'highlight',
                path: '/system/record',
                component: './manageUserAudit/manage-audit-record',
              },
            ],
          },
        ]
      }
    ],
  },
];

export { dynamicRouters }
