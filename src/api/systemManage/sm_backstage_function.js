// 后台功能管理api
import request from '@/utils/request'
import qs from 'qs'


export function persist(param) { // 新增
    const data = {
        name: param.name,
        code: param.code,
        description: param.description
    }
    return request({
        baseURL: '/api',
        url: '/cp4/system/func/persist',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function remove(param) { // 删除
    const data = {
        id: param.id
    }
    return request({
        baseURL: '/api',
        url: '/cp4/system/func/remove',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function merge(param) { // 修改
    const data = {
        id: param.id,
        name: param.name,
        code: param.code,
        description: param.description
    }
    return request({
        baseURL: '/api',
        url: '/cp4/system/func/merge',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function findPage(param) { // 查询
    const data = {
        name: param.name,
        page: param.page,
        size: param.size
    }
    return request({
        baseURL: '/api',
        url: '/cp4/system/func/findPage',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function findFuncTree(param) { // 查看详情
    const data = {
        funcId: param.funcId
    }
    return request({
        baseURL: '/api',
        url: '/cp4/system/permission/findFuncTree',
        method: 'post',
        data: qs.stringify(data)
    })
}