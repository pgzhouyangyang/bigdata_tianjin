import request from '@/utils/request'

export function Login(loginForm) {
  const obj = {
    account: loginForm.username,
    pwwd: loginForm.password
  }
  return request({
    url: '/user/login.do',
    method: 'POST',
    data: obj,
  })
}
