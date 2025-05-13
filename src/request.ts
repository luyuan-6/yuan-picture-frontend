import axios from "axios";
import {message} from "ant-design-vue";

// 区分开发和生产环境
const DEV_BASE_URL = 'http://localhost:8123';
// const PROD_BASE_URL = "http://xx.xx.xx.xx";
const myAxios = axios.create({
  baseURL: DEV_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    if (data.code === 40100){
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if(!response.request.responseURL.includes('user/get/login') && !window.location.pathname.includes('/user/login')) {
        message.warning("请先登录")
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default myAxios;
