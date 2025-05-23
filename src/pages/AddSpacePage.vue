<template>
  <div id="addSpacePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '编辑空间' : '创建空间' }}
    </h2>
    <a-form :model="formData" layout="vertical" @finish="handleSubmit">
      <a-form-item label="空间名称" name="spaceName">
        <a-input v-model:value="formData.spaceName" allow-clear placeholder="请输入空间名称" />
      </a-form-item>
      <a-form-item label="空间等级" name="spaceLevel">
        <a-select
          v-model:value="formData.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
          placeholder="请输入审核状态"
          style="min-width: 180px"
        />
      </a-form-item>

      <a-form-item>
        <a-button html-type="submit" style="width: 100%" type="primary">提交</a-button>
      </a-form-item>
      <a-card title="空间级别介绍">
        <a-typography-paragraph>
          * 目前仅支持开通普通版，如需升级空间，请联系
          <a href="https://blog.csdn.net/qq_20770569" target="_blank">路远</a>。
        </a-typography-paragraph>
        <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
          {{ spaceLevel.text }}: 空间大小 {{ formatFileSize(spaceLevel.maxSize) }} 图片数量
          {{ spaceLevel.maxCount }}
        </a-typography-paragraph>
      </a-card>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '@/constants/space'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/spaceController'
import { formatFileSize } from '../utils'
import { useRoute } from 'vue-router'

const formData = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_ENUM.COMMON,
})
const loading = ref(false)
const spaceLevelList = ref<API.SpaceLevel[]>([])

const handleSubmit = async (values: any) => {
  const spaceId = oldSpace.value?.id
  loading.value = true
  let res = null
  // 判断是更新还是新增
  if (spaceId) {
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...values,
    })
  } else {
    res = await addSpaceUsingPost({
      ...values,
    })
  }

  if (res.data.code === 0 && res.data.data) {
    const spaceId = res.data.data
    message.success('操作成功')
    // 跳转到空间详情页
    router.push({
      path: `/space/${spaceId}`,
    })
  } else {
    message.error('操作失败' + res.data.message)
  }
  loading.value = false
}

// 获取空间级别信息
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间级别信息失败' + res.data.message)
  }
}

onMounted(() => {
  fetchSpaceLevelList()
})

// 更新操作
const route = useRoute()
const oldSpace = ref<API.SpaceVO>()
// 获取老数据
const getOldSpace = async () => {
  const spaceId = route.query?.id
  if (spaceId) {
    const res = await getSpaceVoByIdUsingGet({
      id: spaceId,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      // 回填数据
      oldSpace.value = data
      formData.spaceName = data.spaceName
      formData.spaceLevel = data.spaceLevel
    }
  }
}
onMounted(() => {
  getOldSpace()
})
</script>

<style scoped>
#addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
