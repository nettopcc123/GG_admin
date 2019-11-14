import { getPeopleData } from '@/api/agentPlatForm/systemManage/ag_configOnlinePeople'


const ag_configOnlinePeople = {
    state: {
        allData: [],
        allDataCount: 0,
        currentPageSize: 2,
        pageSize: 1000,
        page: 0,
        configLoteryId: "", // 查看详情弹框内容参数
        configOnlinePeople: {
            name: "", // 查询条件-主数据名
            disable: ""
        },
        disableArr: [], // 搜索栏下拉
        checkDetailDialog: false, // 查看详情弹框
    },
    getters: {},
    mutations: {
        SET_CONFIGPEOPLE_DATA: (state, data) => {
            state.allData = data.content
            state.allDataCount = data.totalElements
        },
        SET_CONFIGPEOPLE_CURRENTPAGESIZE: (state, data) => {
            state.currentPageSize = data
        },

        SET_CONFIGPEOPLE_PAGE_SIZE: (state, data) => { // 设置当前页码
            state.pageSize = data
        },

        SET_CONFIGPEOPLE_PAGE: (state, data) => { // 设置当前页
            state.page = data
        }
    },
    actions: {
        getconfigOnlinePeopleData({ commit }, data) { // 获取权限列表数据
            commit('SET_CONFIGPEOPLE_DATA', data);
        },
        getconfigOnlinePeopleTableHeight({ commit }, data) { // 获取当前表格高度
            commit('SET_CONFIGPEOPLE_CURRENTPAGESIZE', data)
        },

        getconfigOnlinePeoplePageSize({ commit }, data) { // 获取当前页码
            commit('SET_CONFIGPEOPLE_PAGE_SIZE', data)
        },

        getconfigOnlinePeoplePage({ commit }, data) { // 获取当前页
            commit('SET_CONFIGPEOPLE_PAGE', data)
        }
    }
}

export default ag_configOnlinePeople