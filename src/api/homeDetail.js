import request from '@/utils/request'


export function dzQuery(obj) {
  return request({
    url: '/xzqh/findByOrgcodemc',
    method: 'GET',
    params: obj
  })
}

// 成员数量
export function getRynum(obj) {
  return request({
    url: '/cy/getRynumByOrgcode',
    method: 'GET',
    params: obj
  })
}

// 性别数量
export function getSexnum(obj) {
  return request({
    url: '/cy/getSexnumByOrgcode',
    method: 'GET',
    params: obj
  })
}

// 年龄数量
export function getNlnum(obj) {
  return request({
    url: '/cy/getNlnumByOrgcode',
    method: 'GET',
    params: obj
  })
}


// 民族数量
export function getMznum(obj) {
  return request({
    url: '/cy/getMznumByOrgcode',
    method: 'GET',
    params: obj
  })
}


// 经济合作社
export function getGfSum(obj) {
  return request({
    url: '/cy/getGfSum',
    method: 'GET',
    params: obj
  })
}

// 量化资产总额
export function getLhzczeSum(obj) {
  return request({
    url: '/cy/getLhzczeSum',
    method: 'GET',
    params: obj
  })
}

// 股东类型
export function getGdLx(obj) {
  return request({
    url: '/cy/getGdLx',
    method: 'GET',
    params: obj
  })
}

// 股东数量
export function getGdSum(obj) {
  return request({
    url: '/cy/getGdSum',
    method: 'GET',
    params: obj
  })
}

// 累计分红总额
export function getLjfhzeSum(obj) {
  return request({
    url: '/cy/getLjfhzeSum',
    method: 'GET',
    params: obj
  })
}
