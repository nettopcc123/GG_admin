import request from '@/utils/request'
import qs from 'qs'



export function getPeopleData(param) { // 请求人数设置表格数据
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/cpconfig/onlineLargeVer/findAgentPage',
        method: 'post',
        data: qs.stringify(param)
    })
}

export function enable(param) { // 启用
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/cpconfig/onlineLargeVer/agentOnlineUse',
        method: 'post',
        data: qs.stringify(param)
    })
}

export function checkDetail(param) { // 查看详情
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/cpconfig/lotteryOnlineVer/onlineConfig',
        method: 'post',
        data: qs.stringify(param)
    })
}

export function visonDrapDown() { // 版本下拉
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/cpconfig/onlineLargeVer/dropdownList',
        method: 'post',
    })
}