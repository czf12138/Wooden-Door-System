import request from '@/utils/request'

export function login(data) {
  return  request({
    // url: '/vue-admin-template/user/login',
    // method: 'post',
    // data
    url: 'Login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-admin-template/user/info',
    // method: 'get',
    // params: { token }
    url: 'Login',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    // url: '/vue-admin-template/user/logout',
    // method: 'post'
    url: 'Login',
    method: 'delete'
  })
}
