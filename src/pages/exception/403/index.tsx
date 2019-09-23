import Link from 'umi/link';
import React from 'react';
import Exception from '../components/Exception';

export default () => (
  <Exception
    type="403"
    desc="抱歉，你无权访问该页面"
    linkElement={Link}
    backText="返回首页"
  />
);
