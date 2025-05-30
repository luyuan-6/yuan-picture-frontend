
<template>
  <div id="personalInfo">
    <div class="profile-page">
      <a-card :bordered="false" class="profile-card">
        <div class="profile-header">
          <div
            :style="{ backgroundImage: `url(${userInfo.coverImage})` }"
            class="profile-cover"
          ></div>
          <div class="profile-header-content">
            <a-avatar :size="120" :src="userInfo.userAvatar" class="profile-avatar" />
            <div class="profile-title">
              <h1>{{ userInfo.userName }}</h1>
              <div class="profile-badges">
                <a-tag color="purple">{{ userInfo.userRole }}</a-tag>
                <a-tag v-if="tmpInfo.verified" color="green">
                  <check-outlined />
                  已认证
                </a-tag>
              </div>
              <div class="profile-bio">{{ userInfo.userProfile }}</div>
            </div>
            <div class="profile-actions">
              <a-button shape="round" size="large" type="primary" @click="showEditModal">
                <edit-outlined />
                编辑资料
              </a-button>
            </div>
          </div>
        </div>

        <a-row :gutter="24" class="profile-stats-container">
          <a-col :span="6">
            <div class="profile-stat-card">
              <upload-outlined class="stat-icon" />
              <div class="stat-value">{{ tmpInfo.stats.uploads }}</div>
              <div class="stat-label">上传素材</div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="profile-stat-card">
              <eye-outlined class="stat-icon" />
              <div class="stat-value">{{ tmpInfo.stats.views }}</div>
              <div class="stat-label">总浏览量</div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="profile-stat-card">
              <download-outlined class="stat-icon" />
              <div class="stat-value">{{ tmpInfo.stats.downloads }}</div>
              <div class="stat-label">总下载量</div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="profile-stat-card">
              <like-outlined class="stat-icon" />
              <div class="stat-value">{{ tmpInfo.stats.likes }}</div>
              <div class="stat-label">获赞数</div>
            </div>
          </a-col>
        </a-row>

        <a-tabs class="profile-tabs">
          <a-tab-pane key="1" tab="个人资料">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-card class="info-card" title="基本信息">
                  <a-descriptions :column="1" bordered>
                    <a-descriptions-item label="电子邮箱">
                      <a-typography-text copyable>{{ userInfo.email }}</a-typography-text>
                    </a-descriptions-item>
                    <a-descriptions-item label="联系电话">{{ userInfo.phone }}</a-descriptions-item>
                    <a-descriptions-item label="创作领域">{{ userInfo.field }}</a-descriptions-item>
                    <a-descriptions-item label="入驻时间">
                      {{ dayjs.utc(userInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </a-descriptions-item>
                    <a-descriptions-item label="个人网站">
                      <a :href="userInfo.website" target="_blank">{{ userInfo.website }}</a>
                    </a-descriptions-item>
                  </a-descriptions>
                </a-card>
              </a-col>
              <a-col :span="12">
                <a-card class="info-card" title="专业技能">
                  <div v-for="(skill, index) in userInfo.skills" :key="index" class="skill-item">
                    <div class="skill-header">
                      <span class="skill-name">{{ skill.name }}</span>
                      <span class="skill-level">{{ skill.level }}%</span>
                    </div>
                    <a-progress
                      :percent="skill.level"
                      :show-info="false"
                      :stroke-color="skill.color"
                      :stroke-width="8"
                    />
                  </div>
                </a-card>

                <a-card class="info-card categories-card" title="擅长素材分类">
                  <div class="categories-container">
                    <a-tag
                      v-for="(category, index) in userInfo.categories"
                      :key="index"
                      :color="category.color"
                      class="category-tag"
                    >
                      {{ category.name }}
                    </a-tag>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="热门素材">
            <div class="materials-grid">
              <a-card
                v-for="(material, index) in tmpInfo.popularMaterials"
                :key="index"
                class="material-card"
                hoverable
              >
                <template #cover>
                  <div
                    :style="{ backgroundImage: `url(${material.thumbnail})` }"
                    class="material-preview"
                  >
                    <div class="material-stats">
                      <eye-outlined />
                      {{ material.views }}
                      <download-outlined />
                      {{ material.downloads }}
                    </div>
                  </div>
                </template>
                <a-card-meta :title="material.title">
                  <template #description>
                    <div class="material-info">
                      <a-tag color="blue">{{ material.type }}</a-tag>
                      <span class="material-date">{{ material.date }}</span>
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- 编辑个人信息模态框 -->
      <a-modal
        v-model:visible="editModalVisible"
        cancelText="取消"
        okText="保存"
        title="编辑个人信息"
        width="700px"
        @ok="handleSaveInfo"
      >
        <a-form :label-col="{ span: 6 }" :model="editForm" :wrapper-col="{ span: 18 }">
          <a-tabs>
            <a-tab-pane key="basic" tab="基本信息">
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="头像">
                    <div class="avatar-upload">
                      <a-avatar :size="80" :src="editForm.userAvatar" />
                      <a-upload :before-upload="beforeAvatarUpload" :show-upload-list="false">
                        <a-button type="primary">更换头像</a-button>
                      </a-upload>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="封面图">
                    <div
                      :style="{ backgroundImage: `url(${editForm.coverImage})` }"
                      class="cover-preview"
                    >
                      <a-upload :before-upload="beforeCoverUpload" :show-upload-list="false">
                        <a-button type="primary">更换封面</a-button>
                      </a-upload>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="姓名" name="name">
                    <a-input v-model:value="editForm.userName" placeholder="请输入姓名" />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="性别" name="role">
                    <a-select
                      v-model:value="editForm.gender"
                      :options="genders"
                      placeholder="请输入性别"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="个人简介" name="bio">
                    <a-textarea
                      v-model:value="editForm.userProfile"
                      :rows="3"
                      placeholder="请输入个人简介"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="电子邮箱" name="email">
                    <a-input v-model:value="editForm.email" placeholder="请输入电子邮箱" />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="联系电话" name="phone">
                    <a-input v-model:value="editForm.phone" placeholder="请输入联系电话" />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="创作领域" name="field">
                    <a-input v-model:value="editForm.field" placeholder="请输入创作领域" />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="个人网站" name="website">
                    <a-input v-model:value="editForm.website" placeholder="请输入个人网站" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-tab-pane>

            <a-tab-pane key="skills" tab="专业技能">
              <div v-for="(skill, index) in editForm.skills" :key="index" class="edit-skill-item">
                <a-row :gutter="16" align="middle">
                  <a-col :span="8">
                    <a-input v-model:value="skill.name" placeholder="技能名称" />
                  </a-col>
                  <a-col :span="10">
                    <a-slider v-model:value="skill.level" :max="100" :min="0" :step="5" />
                  </a-col>
                  <a-col :span="4">
                    <a-input-number
                      v-model:value="skill.level"
                      :max="100"
                      :min="0"
                      style="width: 100%"
                    />
                  </a-col>
                  <a-col :span="2">
                    <a-button danger type="text" @click="removeSkill(index)">
                      <delete-outlined />
                    </a-button>
                  </a-col>
                </a-row>
              </div>
              <a-button block class="add-button" type="dashed" @click="addSkill">
                <plus-outlined />
                添加技能
              </a-button>
            </a-tab-pane>

            <a-tab-pane key="categories" tab="擅长分类">
              <div class="edit-categories">
                <a-tag
                  v-for="(category, index) in editForm.categories"
                  :key="index"
                  :color="category.color"
                  class="edit-category-tag"
                  closable
                  @close="removeCategory(index)"
                >
                  {{ category.name }}
                </a-tag>
                <a-input
                  v-if="isAddingCategory"
                  ref="categoryInputRef"
                  v-model:value="newCategory"
                  :style="{ width: '120px' }"
                  size="small"
                  type="text"
                  @blur="handleCategoryInputConfirm"
                  @pressEnter="handleCategoryInputConfirm"
                />
                <a-tag v-else class="site-tag-plus" @click="showCategoryInput">
                  <plus-outlined />
                  新增分类
                </a-tag>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  CheckOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { getUserVoByIdUsingPost, userUpdatePersonalInfoUsingPost } from '@/api/userController'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const genders = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
]
const userInfo = ref({
  userName: '',
  role: '',
  verified: true,
  userAvatar: '',
  coverImage: '',
  userProfile: '',
  email: '',
  phone: '',
  field: '',
  createTime: '',
  website: '',
  skills: [],
  categories: [],
})
// 根据 id 获取当前用户信息
const getUserInfoById = async (id) => {
  const res = await getUserVoByIdUsingPost({ id })
  if (res.data.data) {
    userInfo.value = res.data.data
    userInfo.value.skills = JSON.parse(res.data.data.skills)
    userInfo.value.categories = JSON.parse(res.data.data.categories)
  } else {
    message.error('获取当前用户信息失败')
  }
}

onMounted(() => {
  const loginUserStore = useLoginUserStore()
  const user = loginUserStore.loginUser
  getUserInfoById(user.id)
})

const tmpInfo = {
  stats: {
    uploads: 286,
    views: '25.8万',
    downloads: '3.2万',
    likes: '1.5万',
  },
  popularMaterials: [
    {
      title: '现代科技UI组件库',
      thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      type: 'UI套件',
      date: '2023-05-16',
      views: 12563,
      downloads: 3452,
    },
    {
      title: '创意3D图标合集',
      thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      type: '图标',
      date: '2023-04-22',
      views: 9872,
      downloads: 2341,
    },
    {
      title: '手绘风格插画集',
      thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      type: '插画',
      date: '2023-03-10',
      views: 8765,
      downloads: 1987,
    },
    {
      title: '科技产品样机合集',
      thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      type: '样机',
      date: '2023-02-28',
      views: 7632,
      downloads: 1453,
    },
  ],
}

// 编辑模态框相关
const editModalVisible = ref(false)
const editForm = reactive({
  userName: '',
  gender: '',
  userAvatar: '',
  coverImage: '',
  userProfile: '',
  email: '',
  phone: '',
  field: '',
  website: '',
  skills: [],
  categories: [],
})

// 打开编辑模态框
const showEditModal = () => {
  // 复制当前用户信息到表单
  editForm.userName = userInfo.value.userName
  editForm.gender = userInfo.value.gender
  editForm.userAvatar = userInfo.value.userAvatar
  editForm.coverImage = userInfo.value.coverImage
  editForm.userProfile = userInfo.value.userProfile
  editForm.email = userInfo.value.email
  editForm.phone = userInfo.value.phone
  editForm.field = userInfo.value.field
  editForm.website = userInfo.value.website

  // 深拷贝数组对象，避免直接修改原始数据
  editForm.skills = userInfo.value.skills
  editForm.categories = userInfo.value.categories
  editModalVisible.value = true
}

// 保存个人信息
const handleSaveInfo = async () => {
  // 更新用户信息
  editForm.id = userInfo.value.id
  const res = await userUpdatePersonalInfoUsingPost({ ...editForm })
  if (res.data.data) {
    userInfo.value.userName = editForm.userName
    userInfo.value.gender = editForm.gender
    userInfo.value.avatar = editForm.avatar
    userInfo.value.coverImage = editForm.coverImage
    userInfo.value.bio = editForm.userProfile
    userInfo.value.email = editForm.email
    userInfo.value.phone = editForm.phone
    userInfo.value.field = editForm.field
    userInfo.value.website = editForm.website
    userInfo.value.skills = [...editForm.skills]
    userInfo.value.categories = [...editForm.categories]
    await getUserInfoById(userInfo.value.id)
    message.success('个人信息更新成功')
    editModalVisible.value = false
  } else {
    message.error('个人信息更新失败 ' + res.data.message)
  }
  editModalVisible.value = false
}

// 头像上传前处理
const beforeAvatarUpload = (file) => {
  // 在实际应用中，这里应该调用上传API
  // 这里简单模拟一下，假装上传成功并返回URL
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    editForm.avatar = reader.result
  }
  return false // 阻止默认上传行为
}

// 封面图上传前处理
const beforeCoverUpload = (file) => {
  // 同上，模拟上传
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    editForm.coverImage = reader.result
  }
  return false // 阻止默认上传行为
}

// 添加技能
const addSkill = () => {
  editForm.skills.push({
    name: '',
    level: 50,
    color: getRandomColor(),
  })
}

// 删除技能
const removeSkill = (index) => {
  editForm.skills.splice(index, 1)
}

// 生成随机颜色
const getRandomColor = () => {
  const colors = ['#1890ff', '#ff7a45', '#52c41a', '#722ed1', '#faad14', '#eb2f96', '#2db7f5']
  return colors[Math.floor(Math.random() * colors.length)]
}

// 分类标签相关
const isAddingCategory = ref(false)
const newCategory = ref('')
const categoryInputRef = ref(null)

// 显示添加分类的输入框
const showCategoryInput = () => {
  isAddingCategory.value = true
  nextTick(() => {
    categoryInputRef.value?.focus()
  })
}

// 处理分类输入确认
const handleCategoryInputConfirm = () => {
  if (newCategory.value.trim()) {
    editForm.categories.push({
      name: newCategory.value.trim(),
      color: getRandomColor(),
    })
  }
  isAddingCategory.value = false
  newCategory.value = ''
}

// 删除分类
const removeCategory = (index) => {
  editForm.categories.splice(index, 1)
}
</script>

<style scoped>
#personalInfo {
  padding: 0;
  max-width: 2000px;
  margin: 0 auto;
}
.profile-page {
  background-color: #fff;
  padding: 24px;
}

.profile-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.profile-header {
  position: relative;
  margin-bottom: 36px;
}

.profile-cover {
  height: 200px;
  background-position: center;
  background-size: cover;
  border-radius: 8px 8px 0 0;
}

.profile-header-content {
  display: flex;
  padding: 0 24px;
  margin-top: -60px;
  position: relative;
}

.profile-avatar {
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-title {
  margin-left: 24px;
  padding-top: 60px;
  flex: 1;
}

.profile-title h1 {
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.profile-badges {
  margin-bottom: 12px;
}

.profile-badges .ant-tag {
  margin-right: 8px;
  font-size: 14px;
  padding: 2px 10px;
  border-radius: 12px;
}

.profile-bio {
  color: #666;
  font-size: 14px;
  max-width: 600px;
}

.profile-actions {
  padding-top: 60px;
  display: flex;
  align-items: flex-start;
}

.profile-stats-container {
  margin: 12px 0 36px;
}

.profile-stat-card {
  background: #fafafa;
  padding: 24px;
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.profile-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 28px;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.profile-tabs {
  margin-top: 24px;
}

.profile-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 24px;
}

.info-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.skill-item {
  margin-bottom: 16px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.skill-name {
  font-weight: 500;
}

.skill-level {
  color: #8c8c8c;
}

.categories-card {
  min-height: 200px;
}

.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-tag {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 16px;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.material-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.material-card:hover {
  transform: translateY(-6px);
}

.material-preview {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.material-stats {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 4px 10px;
  font-size: 12px;
  border-top-left-radius: 8px;
}

.material-stats i {
  margin-right: 4px;
  margin-left: 8px;
}

.material-stats i:first-child {
  margin-left: 0;
}

.material-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.material-date {
  color: #8c8c8c;
  font-size: 12px;
}

/* 编辑模态框样式 */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cover-preview {
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 12px;
}

.edit-skill-item {
  margin-bottom: 16px;
}

.add-button {
  margin-top: 12px;
}

.edit-categories {
  padding: 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.edit-category-tag {
  padding: 6px 10px;
  font-size: 14px;
}

.site-tag-plus {
  border-style: dashed;
  cursor: pointer;
}
</style>
