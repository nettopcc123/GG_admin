const sm_buffer = { // 缓存数据管理
    state: {
        allData: [],
        allDataCount: 0,
        currentPageSize: 2,
        size: 1000,
        page: 1,
        buffer:{
        sortField:"",// 排序字段
        sortType:"", // 排序方式
        buffercontent:"" // 缓存内容
       }
    },
    getters: {},
    mutations: {
        SET_BUFFER_DATAINFO: (state, data) => {
            state.allData = data.content
            state.allDataCount = data.totalElements
        },

        SET_BUFFER_CURRENTPAGESIZE: (state, data) => {
            state.currentPageSize = data
        },

        SET_BUFFER_PAGE_SIZE: (state, data) => { // 设置当前页码
            state.size = data
        },

        SET_BUFFER_PAGE: (state, data) => { // 设置当前页
            state.page = data
        }
    },
    actions: {
         getbufferInfoList({ commit }, data) { // 获取缓存数据接口
            commit('SET_BUFFER_DATAINFO', data)
         },

        getbufferTableHeight({ commit }, data) { // 获取当前表格高度
            commit('SET_BUFFER_CURRENTPAGESIZE', data)
        },

        getbufferPageSize({ commit }, data) { // 获取当前页码
            commit('SET_BUFFER_PAGE_SIZE', data)
        },

        getbufferPage({ commit }, data) { // 获取当前页
            commit('SET_BUFFER_PAGE', data)
        }
    }
}

export default sm_buffer