import request from '@/utils/request'
import qs from 'qs'

export function findOrderPage(param) { // 注单报表查询
    let data = {
            agentInfoIds: param.agentInfoIds, // 代理商老板id列表 ---多选
            // agentInfoIds: param.agentInfoIds_Radio, // 代理商老板id列表 ---单选=
            username: param.username, // 游戏用户名称
            betNo: param.betNo, // 注单号码
            settleStatus: param.settleStatus, //注单结算状态
            device: param.device, // 终端设备
            gameNo: param.gameNo, // 开奖期号
            parentLotteryId: param.parentLotteryId, // 一级彩种名称 
            lotteryId: param.lotteryId, // 二级彩种名称
            menuPlayRuleId: param.menuPlayRuleId, // 一级玩法Id
            playRuleId: param.playRuleId, // 二级玩法Id
            amountMin: param.amountMin, // 起始 投注金额
            amountMax: param.amountMax, // 截止 投注金额
            winlossAmountMin: param.winlossAmountMin, // 起始 输赢金额
            winlossAmountMax: param.winlossAmountMax, // 截止 输赢金额
            betTimeBegin: param.BetOnTime[0], // 下注时间(开始)
            betTimeEnd: param.BetOnTime[1],
            betTradeNo: param.betTradeNo, // 平台交易流水号【下注扣款】
            settleTradeNo: param.settleTradeNo, //平台交易流水号【注单结算】
            ip:param.ip, // 下注ip
            page: param.page,
            size: param.size,
        }
    // 多选时 代理商老板id列表为全部时
    if (data.agentInfoIds[0] == "") {
        data.agentInfoIds = ""
    }
    return request({
        baseURL: '/api',
        url: '/cp4/order/orderPer/findPage',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function exportExcel(param) { // 导出
    let data = {
            agentInfoIds: param.agentInfoIds, // 代理商老板id列表 ---多选
            // agentInfoIds: param.agentInfoIds_Radio, // 代理商老板id列表 ---单选=
            username: param.username, // 游戏用户名称
            betNo: param.betNo, // 注单号码
            settleStatus: param.settleStatus, //注单结算状态
            device: param.device, // 终端设备
            gameNo: param.gameNo, // 开奖期号
            parentLotteryId: param.parentLotteryId, // 一级彩种名称 
            lotteryId: param.lotteryId, // 二级彩种名称
            menuPlayRuleId: param.menuPlayRuleId, // 一级玩法Id
            playRuleId: param.playRuleId, // 二级玩法Id
            amountMin: param.amountMin, // 起始 投注金额
            amountMax: param.amountMax, // 截止 投注金额
            winlossAmountMin: param.winlossAmountMin, // 起始 输赢金额
            winlossAmountMax: param.winlossAmountMax, // 截止 输赢金额
            betTimeBegin: param.BetOnTime[0], // 下注时间(开始)
            betTimeEnd: param.BetOnTime[1],
            betTradeNo: param.betTradeNo, // 平台交易流水号【下注扣款】
            settleTradeNo: param.settleTradeNo, //平台交易流水号【注单结算】
            ip:param.ip, // 下注ip
            page: param.page,
            size: param.size,
        }
    // 多选时 代理商老板id列表为全部时
    if (data.agentInfoIds[0] == "") {
        data.agentInfoIds = ""
    }
    return request({
        baseURL: '/api',
        url: '/cp4/order/orderPer/export',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function findDetail(param) { // 查看详情
    let data = {};
    if (param.radioViewFull == "1") { // 平台交易流水号【下注扣款】
        data = {
            //   betNo: param.betNo, // 注单号码 
            betTradeNo: param.betTradeNo, // 平台交易流水号【下注扣款】
            agentInfoId: param.agentInfoId, // 代理商老板账号
        }
    } else if (param.radioViewFull == "2") { // 平台交易流水号【注单结算】
        data = {
            //   betNo: param.betNo, // 注单号码 
            settleTradeNo: param.settleTradeNo, // 平台交易流水号【注单结算】
            agentInfoId: param.agentInfoId, // 代理商老板账号
        }
    }
    return request({
        baseURL: '/api',
        url: '/cp4/order/orderPer/findDetail',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 当期开奖结果
export function getOPenResult(param) { // 当期开奖结果

    return request({
        baseURL: '/api',
        url: '/cp4/prize/prizeConfirm/findPrizeNo',
        method: 'post',
        data: qs.stringify(param)
    })
}