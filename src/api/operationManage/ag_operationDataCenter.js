import request from '@/utils/request'
import qs from 'qs'

export function findPage(param) { // 查询(按钮)
    const data = {
     // agentInfoIds: param.agentInfoIds, // 代理商老板id列表 ---多选
        agentInfoIds: param.agentInfoIds_Radio, // 代理商老板id列表 ---单选=
        page: param.page,
        size: param.size,
        obtainTimeBegin:param.dateTime[0],
        obtainTimeEnd:param.dateTime[1]
    }
    // if(data.agentInfoIds[0]==""){
    //     data.agentInfoIds = ""
    // }
    return request({
        baseURL: '/api', 
        url: '/cp4/statistic/operationDetail/findPage',
        method: 'post',
        data: qs.stringify(data)
    })
}

