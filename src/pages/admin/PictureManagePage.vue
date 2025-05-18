<template>
  <div id="pictureManagePage">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space
        ><a-button type="primary" herf="/add_picture" target="_blank">+ 创建图片</a-button></a-space
      >
    </a-flex>
    <!--    搜索框-->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-top: 16px">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="请输入名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="类型" name="category">
        <a-input v-model:value="searchParams.category" placeholder="请输入类型" />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          placeholder="请输入标签"
          mode="tags"
          allow-clear
          style="min-width: 180px"
        />
      </a-form-item>
      <a-form-item label="审核状态" name="reviewStatus">
        <a-select
          v-model:value="searchParams.reviewStatus"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          placeholder="请输入审核状态"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px"></div>
    <!--   表格-->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" width="50" />
        </template>
        <template v-else-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'picInfo'">
          <div>格式 ： {{ record.picFormat }}</div>
          <div>宽度 ： {{ record.picWidth }}</div>
          <div>高度 ： {{ record.picHeight }}</div>
          <div>宽高比 ： {{ record.picScale }}</div>
          <div>大小 ： {{ formatFileSize(record.picSize) }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'reviewMessage'">
          <div>审核状态 ： {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
          <div>审核信息 ： {{ record.reviewMessage }}</div>
          <div>审核人 ： {{ record.reviewerId }}</div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs.utc(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs.utc(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              success
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              <template #icon><CheckCircleOutlined /></template>通过
            </a-button>

            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              warning
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              <template #icon><CloseCircleOutlined /></template>拒绝
            </a-button>

            <a-button danger @click="doDelete(record.id)">
              <template #icon><DeleteOutlined /></template>删除
            </a-button>

            <a-button type="primary" :href="`/add_picture?id=${record.id}`" target="_blank">
              <template #icon><EditOutlined /></template>编辑
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
} from '@/api/pictureController'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { formatFileSize } from '../../utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '../../constants/picture'
dayjs.extend(utc)
// 表格列
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref([])
const total = ref(0)

// 搜索条件
const searchParams = reactive(<API.PictureQueryRequest>{
  current: 1,
  pageSize: 2,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

// 获取数据
const fetchData = async () => {
  console.log('[fetchData] searchParams = ', searchParams)
  const res = await listPictureByPageUsingPost({ ...searchParams })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取图片列表失败' + res.message)
  }
}
// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}
// 删除用户
const doDelete = async (id: string) => {
  if (!id) {
    message.error('请选择要删除的用户')
    return
  }
  console.log('[doDelete] id = ', id)
  const res = await deletePictureUsingPost({ id })
  console.log('[doDelete] res = ', res)
  if (res.data.code === 0) {
    message.success('删除成功')
    searchParams.current = 1
    // 从后端获取数据
    await fetchData()
  } else {
    message.error('删除失败' + res.message)
  }
}
// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'

  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewMessage,
    reviewStatus,
  })

  if (res.data.code === 0) {
    message.success('审核操作成功')
    fetchData()
  } else {
    message.error('审核操作失败' + res.data.message)
  }
}
</script>

<style scoped></style>
