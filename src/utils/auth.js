import Cookies from 'js-cookie'

const TokenKey = 'User-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTokenForLogin(obj) {
  const xzqh = obj.xzqh
  Cookies.set('orgcode', xzqh.orgcode);
  Cookies.set('orgnow', xzqh.orgcode);
  Cookies.set('orgcodeyh', xzqh.orgcode);
  Cookies.set('orglevel', xzqh.orglevel);
  Cookies.set('orgname', xzqh.orgname);
  Cookies.set('orgnowname', xzqh.orgname);
}
