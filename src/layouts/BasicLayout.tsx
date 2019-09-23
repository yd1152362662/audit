/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  DefaultFooter,
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';

import React, { useState, useEffect } from 'react';

import Link from 'umi/link';
import { connect } from 'dva';
import { router } from 'umi';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';

import logo from '../assets/logo.png';
import { ConnectProps, ConnectState } from '@/models/connect';

export interface BasicLayoutProps extends ProLayoutProps, Omit<ConnectProps, 'location'> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    // console.log('menuDataRender:', item)
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const footerRender: BasicLayoutProps['footerRender'] = () => (
  <DefaultFooter
    links={[
      {
        key: 'brahma Technology Co. Ltd.',
        title: 'brahma Technology Co. Ltd.',
        href: 'https://fantudl.com',
        blankTarget: true,
      },
      {
        key: '哆啦快运',
        title: '哆啦快运',
        href: 'https://fantudl.com',
        blankTarget: true,
      },
    ]}
    copyright="2019梵途科技技术部出品"
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings } = props;
  // TODO 获取菜单列表逻辑 👍

  const data = [
    {
      authority: [],
      children: [],
      path: "/",
      component: "/Welcome",
      name: 'welcome',
      icon: "book",
      hideInMenu: false,
      hideChildrenInMenu: false
    },
     {
      authority: [],
      children: [
        {
          authority: [],
          children: [],
          path: "/system/user",
          component: "/manageUserAudit/manage-user-audit",
          name: '用户审核',
          icon: "user",
          hideInMenu: false,
          hideChildrenInMenu: false
        },
        {
          authority: [],
          children: [],
          path: "/system/car",
          component: "/manageUserAudit/manage-car-audit",
          name: '车辆审核',
          icon: "car",
          hideInMenu: false,
          hideChildrenInMenu: false
        },
        {
          authority: [],
          children: [],
          path: "/system/record",
          component: "/manageUserAudit/manage-audit-record",
          name: '审核记录',
          icon: "file-text",
          hideInMenu: false,
          hideChildrenInMenu: false
        }
      ],
      path: "/system",
      component: "",
      name: "审核",
      icon: "form",
      hideInMenu: false,
      hideChildrenInMenu: false
    }
  ]
  const [menuData, setMenuData] = useState(data);
  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

  return (
    <ProLayout
      logo={logo}
      siderWidth={226}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => (
        <Link to={menuItemProps.path}>{defaultDom}</Link>
      )}
      itemRender={item => <label style={{ color: 'gray' }}>{item.breadcrumbName}</label>}
      footerRender={footerRender}
      menuDataRender={() => menuData}
      // menuDataRender={menuDataRender}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  global,
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
