// 后台功能管理 状态管理
const sm_backstage_function = {
    state: {
        tableData: [], // 表格数据
        formInline: { // 查询条件
            apiName: '', // 接口name
        },
        dataListTotal: 0, // 列表数据总条数
        currentPageSize: 2, // 表格高度
        page: 1, // 当前页码
        pageSize: 10, // 每页显示条数
    },
    getters: {

    },
    mutations: {
        SET_CURRENTPAGESIZE: (state, data) => { // 表格高度
            state.currentPageSize = data
        },
        SET_DATALISTTOTAL: (state, data) => { // 列表数据总条数
            state.dataListTotal = data
        },
        SET_DATALISTTOTALSIZA: (state, data) => { // 每页显示条数
            state.pageSize = data
        },
        SET_DATALISTTOTALPAGE: (state, data) => { // 显示每页
            state.page = data
        },
        SET_TABLEDATA: (state, data) => { // 表格数据
            state.tableData = data
        },
    },
    actions: {
        // getUserInfo({ commit }, data) { // 模板
        //     return new Promise((resolve, reject) => {
        //         findPage(data).then(response => {
        //             if (response.data.success == 1) {
        //                 let data = response.data.content;
        //                 commit('SET_USERDATA', data)
        //                 resolve(response.data)
        //             } else {
        //                 let data = { content: [], totalElements: 0, respMsg: response.data.respMsg, success: 2 }
        //                 commit('SET_USERDATA', data);
        //                 resolve(data)
        //             }

        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },

        getcurrentPageSize({ commit }, data) { // 表格高度
            commit('SET_CURRENTPAGESIZE', data)
        },
        getDataListTotal({ commit }, data) { // 列表数据总条数
            commit('SET_DATALISTTOTAL', data)
        },
        getDatasizeTotal({ commit }, data) { // 每页显示条数
            commit('SET_DATALISTTOTALSIZA', data)
        },
        getDatapageTotal({ commit }, data) { // 显示每页
            commit('SET_DATALISTTOTALPAGE', data)
        },
        getTableData({ commit }, data) { // 表格数据
            commit('SET_TABLEDATA', data)
        },
    }
}

export default sm_backstage_function