import request from '@/utils/request'
import qs from 'qs'

export function getShowPeopleList(data) { // 查询(按钮)
    return request({
        baseURL: '/api',
        url: '/cp4/cpconfig/lotteryOnlineVer/findPage',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function newAddPeople(data) { // 新增
    return request({
        baseURL: '/api',
        url: '/cp4/cpconfig/lotteryOnlineVer/persist',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function editMark(data) { // 编辑说明
    return request({
        baseURL: '/api',
        url: '/cp4/cpconfig/lotteryOnlineVer/mergeDescription',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function findDetail(data) { // 玩法
    return request({
        baseURL: '/api',
        url: '/cp4/cpconfig/quotaLargeVerLottery/findDetail',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function configOnlinePeople(data) { // 设置人数（查看详情）
    return request({
        baseURL: '/api',
        url: '/cp4/cpconfig/lotteryOnlineVer/findOnlineConfig',
        method: 'post',
        data: qs.stringify(data)
    })
}


export function saveConfig(data) { // 保存设置的人数
    return request({
        baseURL: '/api',
        url: '/cp4/cpconfig/lotteryOnlineVer/mergeForConfig',
        method: 'post',
        data: data
    })
}