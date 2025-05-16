<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">图链协同平台</div>
          </div>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="menus"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="loginUserStore.loginUser.userAvatar"></a-avatar>
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'
import checkAccess from '@/access/checkAccess'
// 当前选中菜单
const current = ref<string[]>([])
const loginUserStore = useLoginUserStore()
const originMenus = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片',
  },
]
// 过滤菜单项
// const filterMenuItems = (menus = [] as MenuProps['items']) => {
//   return menus?.filter((item) => {
//     if (item.key.startsWith('/admin')) {
//       const loginUser = loginUserStore.loginUser
//       if (!loginUser || loginUser.userRole !== 'admin'){
//         return false
//       }
//     }
//     return true
//   })
// }
const menuToRouteItem = (menu: any): RouteRecordRaw => {
  // 获取所有路由
  const routes = router.getRoutes()
  // 根据菜单的key查找对应的路由
  const route = routes.find((route) => route.path === menu.key)
  // 如果找到对应路由则返回，否则返回一个默认的空路由对象
  return route || ({} as RouteRecordRaw)
}

// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  // 过滤条件是一个回调函数 (menu) => { ... }, 返回 true 表示保留该菜单项，返回 false 表示过滤掉该菜单项
  return menus?.filter((menu) => {
    // 通过menu的key值找到对应的路由字段
    const item = menuToRouteItem(menu)

    // 如果是菜单项中没有对应的路由，就说明该菜单是自定义的，予以保留，返回true
    if (!item.path) {
      return true
    }

    // 如果有hideInMenu标记为true，则隐藏
    if (item.meta?.hideInMenu) {
      return false
    }

    // 根据权限过滤菜单，有权限则返回true，会保留该菜单
    return checkAccess(loginUserStore.loginUser, item.meta?.access as string)
  })
}

// 展示在菜单的路由数组
const menus = computed(() => {
  return filterMenus(originMenus)
})

// 展示在菜单的路由数组
// const items = computed(() => filterMenuItems(originItems))

const router = useRouter()
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 注销
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出成功')
    await router.push({
      path: '/user/login',
    })
  } else {
    message.error('退出登录失败' + res.data.message)
  }
}
</script>
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
