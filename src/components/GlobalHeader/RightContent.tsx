import { Tag } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';

import Avatar from './AvatarDropdown';
import styles from './index.less';


export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
  siteTitle?: string;
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { theme, layout } = props;
  let className = styles.right;
  const realName = {
    id:0,
    realName: '管理员',
    userName: '管理员',
    userType: 1,
    userTypeDesc: 'string',

  }

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <div className={className}>
      <Avatar currentUser={realName} menu />
    </div>
  );
};

// export default connect(({ settings, user }: ConnectState) => ({
//   // theme: settings.navTheme,
//   // layout: settings.layout,
//   // siteTitle: user.siteTitle
// }))(GlobalHeaderRight);
export default GlobalHeaderRight
