<template>
  <div id="ManagePage">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button href="/add_space" target="_blank" type="primary">+ 创建空间</a-button>
      </a-space>
    </a-flex>
    <!--    搜索框-->
    <a-form :model="searchParams" layout="inline" style="margin-top: 16px" @finish="doSearch">
      <a-form-item label="空间名称" name="spaceName">
        <a-input
          v-model:value="searchParams.spaceName"
          allow-clear
          placeholder="请输入空间名称搜索"
        />
      </a-form-item>
      <a-form-item label="用户id" name="userId">
        <a-input
          v-model:value="searchParams.userId"
          allow-clear
          placeholder="请输入用户id搜索"
        />
      </a-form-item>
      <a-form-item label="空间等级" name="spaceLevel">
        <a-select
          v-model:value="searchParams.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
          placeholder="请输入审核状态"
          style="min-width: 180px"
        />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary">搜索</a-button>
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
        <!-- 空间级别 -->
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-tag>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</a-tag>
        </template>
        <!--  使用情况 -->
        <template v-else-if="column.dataIndex === 'spaceUseInfo'">
          <div>
            大小 ： {{ formatFileSize(record.totalSize) }} / {{ formatFileSize(record.maxSize) }}
          </div>
          <div>数量 ： {{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs.utc(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs.utc(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button danger @click="doDelete(record.id)">
              <template #icon>
                <DeleteOutlined />
              </template>
              删除
            </a-button>
            <a-button :href="`/add_space?id=${record.id}`" target="_blank" type="primary">
              <template #icon>
                <EditOutlined />
              </template>
              编辑
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { formatFileSize } from '../../utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constants/space'

dayjs.extend(utc)
// 表格列
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
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
const searchParams = reactive(<API.spaceQueryRequest>{
  current: 1,
  pageSize: 10,
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
  const res = await listSpaceByPageUsingPost({ ...searchParams })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取空间列表失败' + res.message)
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
  const res = await deleteSpaceUsingPost({ id })
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
</script>

<style scoped></style>
