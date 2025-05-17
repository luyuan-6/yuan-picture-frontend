<template>
  <div id="userLoginPage">
    <h1 class="title">图链协同平台 - 登录</h1>
    <div class="desc">企业级 图链协同平台</div>
    <a-form :model="formState" autocomplete="off" @finish="handleSubmit">
      <a-form-item
        name="userAccount"
        :rules="[
          { required: true, message: '请输入你的账号！' },
          { min: 4, message: '账号长度不能小于4位' },
        ]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号">
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
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入你的密码">
          <template #prefix><LockOutlined /></template>
        </a-input-password>
      </a-form-item>
      <div class="tips">
        没有账号?
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>
      <div style="margin-bottom: 16px"></div>
      <a-form-item>
        <a-button style="width: 100%" type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
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

const loginUserStore = useLoginUserStore()
/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
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
    message.error('登录失败' + res.data.message)
  }
}
</script>
<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 100px auto;
}
.title {
  text-align: center;
  margin-bottom: 16px;
  font-size: 32px;
}
.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 32px;
}

.tips {
  margin-top: 16px;
  color: #bbb;
  text-align: center;
  font-size: 14px;
}
</style>
