import request from '@/utils/request'

// 登录
export const Login = (data) => request({ url: '/user/login.do', method: 'POST', data })

// 根据账号orgcode获取该账号上级行政区划列表 第一级则返回当前
export const dzQuery = (params) => request({ url: '/xzqh/findByOrgcodemc', method: 'GET', params })

/**
 * @成果管理
 **/
// 成员数量统计
export const getRynum = (params) => request({ url: '/cy/getRynumByOrgcode', method: 'GET', params })

// 性别分析统计
export const getSexnum = (params) => request({ url: '/cy/getSexnumByOrgcode', method: 'GET', params })

// 年龄分布统计
export const getNlnum = (params) => request({ url: '/cy/getNlnumByOrgcode', method: 'GET', params })

// 民族分析统计
export const getMznum = (params) => request({ url: '/cy/getMznumByOrgcode', method: 'GET', params })

/**
 * @股权管理
 **/
// 经济合作社
export const getGfSum = (params) => request({ url: '/cy/getGfSum', method: 'GET', params })

// 量化资产总额
export const getLhzczeSum = (params) => request({ url: '/cy/getLhzczeSum', method: 'GET', params })

// 股东类型
export const getGdLx = (params) => request({ url: '/cy/getGdLx', method: 'GET', params })

// 股东数量
export const getGdSum = (params) => request({ url: '/cy/getGdSum', method: 'GET', params })

// 累计分红总额
export const getLjfhzeSum = (params) => request({ url: '/cy/getLjfhzeSum', method: 'GET', params })

