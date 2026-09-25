import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 获取全局配置
 */
export function getGlobalConfig() {
  return request({
    url: SERVER_URL + '/api/v1/guest/comm/config',
    method: 'get'
  })
}

/**
 * 获取用户配置
 */
export function getUserConfig() {
  return request({
    url: SERVER_URL + '/api/v1/user/comm/config',
    method: 'get'
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request({
    url: SERVER_URL + '/api/v1/user/info',
    method: 'get'
  })
}

/**
 * 登录
 */
export function userLogin(data) {
  return request({
    url: SERVER_URL + '/api/v1/passport/auth/login',
    method: 'post',
    data
  })
}

/**
 * 注册
 */
export function userRegister(data) {
  return request({
    url: SERVER_URL + '/api/v1/passport/auth/register',
    method: 'post',
    data
  })
}

/**
 * 发送邮箱验证码
 */
export function sendEmailCode(params) {
  return request({
    url: SERVER_URL + '/api/v1/passport/comm/sendEmailVerify',
    method: 'post',
    params
  })
}

/**
 * 重置密码
 */
export function resetPassword(params) {
  return request({
    url: SERVER_URL + '/api/v1/passport/auth/forget',
    method: 'post',
    params
  })
}

/**
 * 修改密码
 */
export function changePassword(params) {
  return request({
    url: SERVER_URL + '/api/v1/user/changePassword',
    method: 'post',
    params
  })
}
