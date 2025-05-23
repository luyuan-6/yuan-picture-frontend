<template>
  <div id="mySpace">
    <p>正在跳转，请稍候...</p>
  </div>
</template>

<script lang="ts" setup>
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listSpaceVoByPageUsingPost } from '@/api/spaceController'
import { message } from 'ant-design-vue'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 检查用户是否有个人空间
const checkUserHasSpace = async () => {
  var loginUser = loginUserStore.loginUser
  if (!loginUser) {
    router.replace('/user/login')
    return
  }
  // 获取用户空间信息
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
  })
  if (res.data.code === 0) {

    if (res.data.data?.records?.length > 0) {
      // 有空间
      const space = res.data.data.records[0]
      router.replace(`/space/${space.id}`)
    } else {
      // 没有空间 去新建一个空间
      router.replace('/add_space')
      message.warn('您还没有创建空间，请先创建一个空间')
    }
  } else {
    message.error('加载我的空间失败' + res.data.message)
  }
}
// 在页面加载时检查用户空间
onMounted(() => {
  checkUserHasSpace()
})
</script>

<style scoped></style>
