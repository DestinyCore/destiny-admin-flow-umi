// 抽离Router的配置信息刀单独文件.

import { IRoute } from 'umi';

export const routerConfig: IRoute[] = [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login'
      }
    ]
  },

  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome'
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome'
      }
    ]
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './ListTableList'
  },
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    component: './404'
  }
];
