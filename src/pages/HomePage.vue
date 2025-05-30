<template>
  <div id="homePage">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        enter-button="搜索"
        placeholder="从海量图片中搜索"
        size="large"
        @search="doSearch"
      >
      </a-input-search>
    </div>
    <!-- 分页和标签筛选 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部"></a-tab-pane>
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category"></a-tab-pane>
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagsList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading"></PictureList>
    <a-pagination
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      style="text-align: right"
      @change="onPageChange"
    >
    </a-pagination>
  </div>
</template>
<script lang="ts" setup>
// 数据
import {onMounted, reactive, ref} from 'vue'
import {listPictureTagCategoryUsingGet, listPictureVoByPageUsingPost,} from '@/api/pictureController'
import {message} from 'ant-design-vue'
import {useRouter} from 'vue-router'
import PictureList from "@/components/PictureList.vue";

const dataList = ref([])
const total = ref(0)
const loading = ref(true)

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagsList = ref<boolean[]>([])

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})
// 分页函数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

// const pagination = computed(() => {
//   return {
//     current: searchParams.current ?? 1,
//     pageSize: searchParams.pageSize ?? 10,
//     total: total,
//     onChange: (page: number, pageSize: number) => {
//       searchParams.current = page
//       searchParams.pageSize = pageSize
//       fetchData()
//     },
//   }
// })

const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    nullSpaceId: true,
    tags: [] as string[],
  }
  // 种类
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  // 标签
  selectedTagsList.value.forEach((selectedTag, index) => {
    if (selectedTag) {
      params.tags.push(tagList.value[index])
    }
  })
  try {
    const res = await listPictureVoByPageUsingPost(params)
    if (res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取图片列表失败' + res.data.message)
    }
  } catch (e) {
    message.error('获取图片列表失败 ' + e)
  }
  loading.value = false
}
// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 搜索
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// 获取标签和分页选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagList.value = res.data.data.tagList ?? []
    categoryList.value = res.data.data.categoryList ?? []
  } else {
    message.error('获取标签和分类选项失败' + res.data.message)
  }
}
onMounted(() => {
  getTagCategoryOptions()
})
const router = useRouter()
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<style scoped>
#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

#homePage .tag-bar {
  margin-bottom: 16px;
}
</style>
