import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AddPicturePage from '@/pages/AddPicturePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'

import ACCESS_ENUM from '@/access/accessEnum'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
import AddPictureBatchPage from '@/pages/AddPictureBatchPage.vue'
import PersonalInfo from '@/components/PersonalInfo.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import AddSpacePage from '@/pages/AddSpacePage.vue'
import MySpacePage from '@/pages/MySpacePage.vue'
import SpaceDetailPage from '@/pages/SpaceDetailPage.vue'
import SearchPicturePage from "@/pages/SearchPicturePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/user/info',
      name: '个人中心',
      component: PersonalInfo,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/admin/userManage',
      name: 'adminUserManage',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicturePage,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/search_picture',
      name: '图片搜索',
      component: SearchPicturePage,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/add_space',
      name: '创建空间',
      component: AddSpacePage,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: MySpacePage,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailPage,
      props: true,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// router.beforeEach(async (to, from, next) => {
//   const loginUserStore = useLoginUserStore()
//   let loginUser = loginUserStore.loginUser
//   console.log('登陆用户信息', loginUser)
//   const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN
//   // 要跳转的页面必须要登陆
//   if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
//     // 如果没登陆，跳转到登录页面
//     if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
//       next(`/user/login?redirect=${to.fullPath}`)
//       return
//     }
//     // 如果已经登陆了，但是权限不足，那么跳转到无权限页面
//     if (!checkAccess(loginUser, needAccess)) {
//       next('/noAuth')
//       return
//     }
//   }
//   next()
// })

export default router
