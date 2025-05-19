<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '编辑图片' : '创建图片' }}
    </h2>
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType"
    >>
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
<!--    <PictureUpload :picture="picture" :onSuccess="onSuccess" />-->
    <a-form v-if="picture" :model="pictureForm" @finish="handleSubmit" layout="vertical">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          allowClear
        />
        <a-form-item label="分类" name="category">
          <a-auto-complete
            v-model:value="pictureForm.category"
            :options="categoryOptions"
            placeholder="请输入分类"
            allowClear
          />
        </a-form-item>
        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="pictureForm.tags"
            :options="tagOptions"
            mode="tags"
            placeholder="请输入标签"
            allowClear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
        </a-form-item>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import {onMounted, reactive, ref} from 'vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import UrlPictureUpload from "@/components/UrlPictureUpload.vue";

const uploadType = ref<'file' | 'url'>('file')

const picture = ref<API.PictureVO>()
const route = useRoute()
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

const pictureForm = reactive<API.PictureAddRequest>({})

const handleSubmit = async (values: any) => {
  const pictureId = picture.value.id
  if (!pictureId) {
    return
  }
  console.log(values)
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败' + res.data.message)
  }
}

const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 需要转换为选项所需格式数据
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取标签和分类选项失败' + res.data.message)
  }
}
onMounted(() => {
  getTagCategoryOptions()
})

// 获取老数据

const getOldPicture = async () => {
  const pictureId = route.query?.id
  if (pictureId) {
    const res = await getPictureVoByIdUsingGet({
      id: pictureId,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      // 回填数据
      console.log(data)
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
      console.log(pictureForm)
    }
  }
}
onMounted(() => {
  getOldPicture()
})
</script>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
