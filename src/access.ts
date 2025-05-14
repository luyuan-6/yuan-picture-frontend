// import router from '@/router'
// import { useLoginUserStore } from '@/stores/useLoginUserStore'
// import { message } from 'ant-design-vue'
// // 是否是首次登录用户
// let isFirstLogin = true
//
// /**
//  * 全局权限校验
//  */
// router.beforeEach(async (to, from, next) => {
//   // 获取当前登录用户信息
//   const loginUserStore = useLoginUserStore()
//   let loginUser = loginUserStore.loginUser
//   // 确保页面刷新时，首次加载的时候，能够等后端返回用户信息再校验权限
//   if (isFirstLogin) {
//     await loginUserStore.fetchLoginUser()
//     const loginUser = loginUserStore.loginUser
//     isFirstLogin = false
//   }
//   const toUrl = to.fullPath
//   if (toUrl.startsWith('/admin')) {
//     if (!loginUser || loginUser.userRole !== 'admin') {
//       message.error('没有权限')
//       next(`/user/login?redirect=${to.fullPath}`)
//       return
//     }
//   }
//   next()
// })
