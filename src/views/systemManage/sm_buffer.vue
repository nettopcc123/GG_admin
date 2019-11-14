<template>
  <!-- 缓存数据管理 -->
  <div class="app-container smData">
    <el-form>
      <ul class="heard-search">
        <li>
          <span class="rem_tit">缓存内容：</span>
          <span class="rem_con"><el-input v-model="buffer.buffercontent" placeholder="请输入缓存内容"  maxlength="30" :disabled="disableControl"></el-input></span>
        </li>
      </ul>
      <el-form-item class="operation-box">
        <el-button type="primary" size="mini" @click.native.prevent="search" :disabled="disableControl">
          <svg-icon icon-class="chaxun" />
          查询
          </el-button>
        <el-button type="primary" size="mini" @click.native.prevent="reset" :disabled="disableControl">
          <svg-icon icon-class="zhongzhi" />
          重置
          </el-button>
        <el-button type="primary" size="mini" @click.native.prevent="refresh" :disabled="disableControl">
          <svg-icon icon-class="shuaxin" />
          刷新缓存
          </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据展示 -->
    <div class="admin_table">
      <el-table 
        :header-cell-style="tableHeaderColor" 
        :cell-style="rowcellClass" 
        key="01" 
        :data="allData" 
        highlight-current-row 
        @current-change="handleMainTableChange"
        style="width: 100%;" 
        border 
        class="tableAuto216"
        @sort-change='sortChange'
        :height="currentPageSize*25 + 34"
        v-loading="loading"
      >
        <el-table-column label width="35" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="table_id" class="hidTextRadio">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" align="center" width="50" show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{scope.$index+(page - 1) * size + 1}} </span>
          </template>
        </el-table-column>
        <el-table-column label="Key" prop="code" align="center"  show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{ scope.row.code ? scope.row.code : '-' }} </span>
          </template>
        </el-table-column>
        <el-table-column  sortable='custom' label="缓存类型" prop="category" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{ scope.row.category ? scope.row.category : '-' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="缓存内容" prop="name" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{ scope.row.name ? scope.row.name : '-' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="说明" prop="description" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{ scope.row.description ? scope.row.description : '-' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createdBy" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{ scope.row.createdBy ? scope.row.createdBy : '-' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdDate" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{ scope.row.createdDate ? scope.row.createdDate : '-' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="最后一次手动刷新时间" prop="lastModifiedDate" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
              <span> {{ scope.row.lastModifiedDate ? scope.row.lastModifiedDate : '-' }} </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!-- <div class="admin_pagination">
      <el-pagination 
        :page-sizes="[10, 20, 50, 100]" 
        :current-page.sync="page"
        background
        :page-size="size" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="allData_total"
        @size-change="handleSizeChange" 
        @current-change="getList" 
      >
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ToEmpty } from '@/utils/validate'
import { findPage ,refreshByCode } from "@/api/systemManage/sm_data";
export default {
  name: "sm_buffer",
  data() {
    return {
      disableControl: false,
      dialogLoading : false, // 设置主数据表格loading
      loading: false, // Loading 加载
      table_id: null, // 表格监听ID
      table_row_data: '', // 选中一行的数据
      dialogHeight: 0,
      dialogMt: this.dialogMt, // 弹出框上边距
    };
  },
  computed: {
    ...mapState({
      allData: state => state.sm_buffer.allData,
      allData_total: state => state.sm_buffer.allDataCount,
      currentPageSize: state => state.sm_buffer.currentPageSize
    }),
    size: {
      get(){
        return this.$store.state.sm_buffer.size;
      },
      set(item){
        return  item;
      }
    },
    page: {
      get(){
        return this.$store.state.sm_buffer.page;
      },
      set(item){
        return  item;
      }
    },
    buffer: {
      get(){
        return this.$store.state.sm_buffer.buffer;
      },
      set(item){
        return  item;
      }
    }
  },
  methods: {
      sortChange(column, prop, order){ // 排序列表
          if (column.order === 'descending') {
            this.$store.state.sm_buffer.buffer.sortField = column.prop
            this.$store.state.sm_buffer.buffer.sortType = 'desc'
          } else {
            this.$store.state.sm_buffer.buffer.sortField = column.prop
            this.$store.state.sm_buffer.buffer.sortType = 'asc'
          }
        this.getList();
      },
    judgeScree(val) { // 判断屏幕大小进行操作
      let a = document.body.offsetHeight - val;
      this.dialogMt = a / 2 + 'px';
      if(a <= 0){
        this.dialogMt = 0 + 'px';
      }
    },
    getList(val) { // 填充表格数据
      if(!val) {
        val = 1;
      }
      this.table_id = "", // 清空表格监听ID
      this.table_row_data = ""; // 清空选中一行的数据
      this.$store.dispatch('getbufferPage',val);
      this.disableControl = true;
      this.loading = true; // 请求接口时loading启用
      this.$store.state.sm_buffer.buffer.buffercontent = ToEmpty(this.$store.state.sm_buffer.buffer.buffercontent);// 缓存内容 去空
      let data = {
          page: this.$store.state.sm_buffer.page,
          size: this.$store.state.sm_buffer.size,
          name: this.$store.state.sm_buffer.buffer.buffercontent,
          sortField: this.$store.state.sm_buffer.buffer.sortField,
          sortType: this.$store.state.sm_buffer.buffer.sortType
        }
       findPage(data).then(res => {
        let resData = res.data;
        let currentPageSize = 2;
        if(resData.success ==1) {
          this.$store.dispatch('getbufferInfoList', resData.content)
          if(resData.content.content.length > 0) {
          currentPageSize = resData.content.content.length;
          }else {
            currentPageSize = 2;
          } 
         this.$store.dispatch('getbufferTableHeight', currentPageSize)
        }else {
          this.$message.error(resData.respMsg)
        }         
        this.loading = false; // 接口返回数据时，loading禁用
        this.disableControl = false;
      }).catch( (err) =>{ // 后台请求返回错误时，把当前列表的loading与 不可编辑都设为初始值
         this.loading = false; // 接口返回数据时，loading禁用
         this.disableControl = false;  // 按钮不可编辑
      })
   
    },
    search() { // 查询方法
      this.getList()
    },
    reset() { // 重置查询条件
      this.$store.state.sm_buffer.buffer = { 
          sortField:"",// 排序字段 
          sortType:"", // 排序方式 
          buffercontent:"" // 缓存内容
      }  
    },
    refresh() { // 刷新
      if(!this.table_id) {
        this.$message.warning('请选择一条数据');
        return false;
      }
      refreshByCode({code: this.table_row_data.code}).then(res => {
        let resData = res.data;
        if(resData.success == 1) {
          this.$message.success("刷新成功")
          this.getList()
        }else {
          this.$message.error(resData.respMsg)
        }
      })
    },
    handleSizeChange(val) { // 页码大小变化时
      this.$store.dispatch('getbufferPageSize', val);
      this.getList();
    },
    handleMainTableChange(val) { // 表格数据行切换方法
      if(val != null) {
        this.table_id = val.id;
        this.table_row_data = val;
      }
    },
    tableHeaderColor() { // 修改row header的背景颜色与内边距
      return "background-color: rgb(247, 251, 254); padding: 4px 0;text-align:center;";
    }, 
    rowcellClass() { // 行的cell样式
      return "padding:0;overflow: hidden !important;white-space: nowrap !important;word-break: keep-all !important;text-overflow: ellipsis !important;";
    },
  },
  mounted(){
    this.$nextTick(() => {
      // this.getList();
      this.judgeScree(this.dialogHeight);  // 判断屏幕大小进行操作
    })
    window.onresize = () =>{
      this.judgeScree(this.dialogHeight);
    };
  },
  created() {
    if(this.$store.getters.alreadyClose.includes(this.$store.getters.currentView)){
      if(this.$store.getters.currentView == this.$route.name) { 
        // 更新已关闭的菜单 数组状态
        let newalreadyClose = [] // 定义一个空数组存 过滤左侧点击的数据
        this.$store.getters.alreadyClose.forEach(value => {
          if(value != this.$store.getters.currentView){
            newalreadyClose.push(value)
          }
        })
        this.$store.dispatch("updataTabClose",newalreadyClose) 
        this.$store.state.sm_buffer.allData = []
        this.$store.state.sm_buffer.allDataCount = 0;
        this.$store.state.sm_buffer.page = 1;
        this.$store.state.sm_buffer.size = 1000;  
        this.$store.state.sm_buffer.buffer = { 
          sortField:"",// 排序字段 
          sortType:"", // 排序方式 
          buffercontent:"" // 缓存内容
          }     
        this.$store.dispatch('getbufferTableHeight', 2)
      }
    }else {
      if(this.$store.state.sm_buffer.allData.length > 0) {
        this.getList()
      }
    }
  }
};
</script>
<style lang="scss" >
.iconstyle{
  font-weight: bold;
}
.smData {
  .data-dialog-title {
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .filters-box {
      .el-radio-button__inner {
        padding: 5px;
        border: none;
        font-size: 12px;
      }
      .is-active {
        .el-radio-button__inner {
          color: #fff;
          background-color: #409EFF;
          border-left: none;
          border-radius: 4px;
        }
      }
    }
  }
}
  
</style>

