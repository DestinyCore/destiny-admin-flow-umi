// 抽离Router的配置信息到单独文件.

import { IRoute } from 'umi';

const Route: IRoute[] = [
  {
    layout: false,
    component: './login',
    path: '/login'
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    name: 'home',
    icon: 'home',
    path: '/home',
    component: './home'
  },
  {
    name: 'tree',
    icon: 'home',
    path: '/treedemo',
    component: './treedemo'
  },
  {
    access: 'canAdmin',
    path: '/system',
    name: 'systemmanage',
    icon: 'setting',
    routes: [
      {
        name: 'rolemanage',
        icon: 'solution',
        path: '/system/role',
        component: './system/role'
      },
      {
        access: 'canAdmin',
        name: 'usermanage',
        icon: 'user',
        path: '/system/user',
        component: './system/user'
      },
      {
        access: 'canAdmin',
        name: 'menumanage',
        icon: 'menu',
        path: '/system/menu',
        component: './system/menu'
      },
      {
        access: 'canAdmin',
        name: 'functionmanage',
        icon: 'menu',
        path: '/system/function',
        component: './system/function'
      }
    ]
  }
];

export default Route;
