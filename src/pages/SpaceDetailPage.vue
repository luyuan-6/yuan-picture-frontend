<template>
  <div id="spaceDetailPage">
    <!-- 空间信息 --->
    <a-flex justify="space-between" >
      <h2>
        {{ loginUserStore.loginUser.userName }} ：{{ space.spaceName }} (私有空间) --
        {{ SPACE_LEVEL_MAP[space.spaceLevel] }}
      </h2>

      <a-space size="middle">
        <a-button :href="`/add_picture?spaceId=${id}`" target="_blank" type="primary">
          + 创建图片
        </a-button>
        <a-tooltip
          :title="`占用空间 ${formatFileSize(space.totalSize)} / ${formatFileSize(space.maxSize)}}`"
        >
          <a-progress
            :percent="((space.totalSize / space.maxSize) * 100).toFixed(1)"
            :size="48"
            type="circle"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading" show-op="true" :onReload="fetchData" />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />

  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { formatFileSize } from '@/utils/index.ts'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import { message } from 'ant-design-vue'
import { listPictureVoByPageUsingPost } from '@/api/pictureController'
import { SPACE_LEVEL_MAP } from '../constants/space'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import PictureList from "@/components/PictureList.vue";

interface Props {
  id: string | number
}

const props = defineProps<Props>()
const space = ref<API.SpaceVO>({})
const loginUserStore = useLoginUserStore()
// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    console.log(res.data.data)
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败' + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
})

// --------- 获取图片数据
// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})
// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
