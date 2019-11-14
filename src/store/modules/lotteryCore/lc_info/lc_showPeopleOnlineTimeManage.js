import { getShowPeopleList } from '@/api/lotteryCore/lc_info/lc_showPeopleOnline'

const lc_showOnlinePeople = {
    state: {
        allData: [],
        allDataCount: 0,
        currentPageSize: 2,
        size: 10,
        page: 1,
        showOnlinePeople: { // 查询条件
            secondPercentVison: "",
            firstLevel: "",
            secondLevel: "",
            disabledSecond: true,
        },
        refeshTable: false, // 刷新表格
        editPercentLotteryDialog: false, // 设置人数，查看详情弹框
        kindAData: [],
        kindBData: [],
        firstLotterySelect: [], // 一级彩种下拉数据
        secondLotterySelect: [], // 二级彩种下拉选择数据
        disableArr: [], // 状态下拉数据
        lotteryCategoryArr: [], // 彩种性质下拉数据
        frequencyArr: [], // 彩种类型
    },
    getters: {

    },
    mutations: {
        GET_SHOWPEOPLEOBLINEDATA: (state, data) => {
            state.allData = data.content;
            state.allDataCount = data.totalElements;
        },
        SET_SHOWPEOPLEOBLINE_TABLE_HEIGHT: (state, data) => {
            state.currentPageSize = data;
        },
        SET_SHOWPEOPLEOBLINE_SIZE: (state, data) => {
            state.size = data;
        },
        SET_SHOWPEOPLEOBLINE_PAGE: (state, data) => {
            state.page = data;
        }
    },
    actions: {
        getShowPeopleList({ commit }, data) { // 请求表格数据
            commit("GET_SHOWPEOPLEOBLINEDATA", data)
        },
        getShowPeopleOnlineTableHeight({ commit }, data) { // 获取当前表格高度
            commit('SET_SHOWPEOPLEOBLINE_TABLE_HEIGHT', data)
        },
        getShowPeopleOnlineSize({ commit }, data) { // 获取当前页码
            commit('SET_SHOWPEOPLEOBLINE_SIZE', data)
        },
        getShowPeopleOnlinePage({ commit }, data) { // 获取当前页
            commit('SET_SHOWPEOPLEOBLINE_PAGE', data)
        }
    }
}

export default lc_showOnlinePeople