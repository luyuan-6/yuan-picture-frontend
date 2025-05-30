<template>
  <div id="userRegisterPage">
    <div class="register-container">
      <a-card class="login-card" :bordered="false">
        <div class="card-background"></div>
        <div class="logo-container">
          <img src="/logo.png" alt="Logo" class="logo" />
        </div>
        <h1 class="title">图链协同平台</h1>
        <div class="desc">企业级 图链协同平台</div>
        <a-form :model="formState" autocomplete="off" @finish="handleSubmit">
          <a-form-item
            name="userAccount"
            :rules="[
              { required: true, message: '请输入你的账号！' },
              { min: 4, message: '账号长度不能小于4位' },
            ]"
          >
            <a-input
              v-model:value="formState.userAccount"
              placeholder="请输入账号"
              size="large"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="userPassword"
            :rules="[
              { required: true, message: '请输入你的密码！' },
              { min: 8, message: '密码长度不能小于8位' },
            ]"
          >
            <a-input-password
              v-model:value="formState.userPassword"
              placeholder="请输入你的密码"
              size="large"
            >
              <template #prefix><LockOutlined /></template>
            </a-input-password>
          </a-form-item>

<!--          <div class="form-actions">-->
<!--            <a-checkbox>记住我</a-checkbox>-->
<!--            <a class="forgot-password">忘记密码?</a>-->
<!--          </div>-->

          <a-form-item>
            <a-button
              class="login-button"
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="register-link">
          没有账号? <RouterLink to="/user/register">立即注册</RouterLink>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { userLoginUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import router from '@/router'
import { message } from 'ant-design-vue'

// 用于接受表单输入的值
const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const loading = ref(false)
const loginUserStore = useLoginUserStore()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  loading.value = true
  try {
    const res = await userLoginUsingPost(values)
    // 登录成功 把登录用户信息保存到全局状态中
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true,
      })
    } else {
      message.error('登录失败: ' + res.data.message)
    }
  } catch (error) {
    message.error('登录请求失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#userRegisterPage {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('/background.png') no-repeat center center;
  background-size: cover;
  position: relative;
}

#userRegisterPage::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.register-container {
  position: relative;
  width: 100%;
  max-width: 450px;
  padding: 20px;
  z-index: 1;
}

.login-card {
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/background.png') no-repeat center center;
  background-size: cover;
  opacity: 0.08;
  z-index: 0;
}

.logo-container,
.title,
.desc,
a-form,
.register-link {
  position: relative;
  z-index: 1;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
}

.title {
  text-align: center;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
}

.desc {
  text-align: center;
  color: #8c8c8c;
  margin-bottom: 32px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.forgot-password {
  color: #1890ff;
  cursor: pointer;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 6px;
}

.register-link {
  margin-top: 16px;
  color: #8c8c8c;
  text-align: center;
  font-size: 14px;
}

.register-link a {
  color: #1890ff;
  font-weight: 500;
}
</style>
