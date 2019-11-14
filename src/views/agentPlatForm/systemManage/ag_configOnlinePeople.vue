<template>
  <!-- 在线人数设置 -->
  <div>
    <!--在线人数管理 ---搜索栏 -->
    <el-form>
      <ul class="heard-search">
        <li>
          <span class="rem_tit">当前使用的在线人数版本名称：</span>
          <span class="rem_con">
            <el-input v-model="configOnlinePeople.name" :disabled="disabledALL" placeholder="请输入投注上限版本名称" maxlength="15"></el-input>
          </span>
        </li>
        <li>
          <span class="rem_tit">是否开启</span>
          <span class="rem_con">
              <el-select v-model="configOnlinePeople.disable" :disabled="disabledALL" value-key="name" placeholder="请选择">
                <el-option v-for="(item,index) in disableArr" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </span>
        </li>
      </ul>
      <el-form-item class="operation-box">
        <el-button type="primary" size="mini" :disabled="disabledALL" @click="getList">
          <svg-icon icon-class="chaxun" /> 
          查询</el-button>
        <el-button type="primary" size="mini" :disabled="disabledALL" @click="resetTable">
            <svg-icon icon-class="zhongzhi" />
          重置</el-button>
        <el-button type="primary" size="mini" :disabled="disabledALL" @click="enableOrUse(148)">
            <svg-icon icon-class="qiyong1" />
          启用</el-button>
        <el-button type="primary" size="mini" :disabled="disabledALL" @click="checkDetail(711)">
          <svg-icon icon-class="chakanxiangqing" />
          查看详情</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格-->
    <div class="people-table-content" >
      <el-table
        style="width: 100%; "
        border
        class="tableAuto216"
        highlight-current-row
        ref="multipleTable"
        :data="allData"
        :height="currentPageSize*25 + 34"
        @current-change="handleCurrentChange"
        v-loading="loading"
      >
        <el-table-column width="35">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="config_people_rowDataId" class="hidTextRadio"></el-radio>
          </template>
        </el-table-column>
        <el-table-column  width="60" align="center" label="序号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="当前使用的在线人数名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" align="center" label="版本说明" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="disable" align="center" label="是否开启"  show-overflow-tooltip>
          <template slot-scope="scope">
          <span> {{ scope.row.disable == false ? '已开启' : '未开启' }} </span>
        </template>
        </el-table-column>
        <el-table-column prop="lastModifiedBy" align="center" label="修改人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="lastModifiedDate" align="center" label="修改时间" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!--启用-->
    <el-dialog :visible.sync="enableOrUseDialog" title="启用" width="350px" :top="dialogMt"  :close-on-click-modal="false">
      <p style="text-align:center;">
        是否确定启用当前使用的在线人数版本
        <span style="color:red">"{{onlinePeople.name}}" </span> ？
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmOkOrStop">确定</el-button>
        <el-button @click="enableOrUseDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog v-if="$store.state.ag_configOnlinePeople.checkDetailDialog" :visible.sync="$store.state.ag_configOnlinePeople.checkDetailDialog" :close-on-click-modal="false" :title="titleName"  width="1150px">
      <dialogDetail :isConfig="1" :id="config_people_rowDataId" :titleName="titleName"></dialogDetail>  
    </el-dialog>
  </div>
</template>
<script>
import dialogDetail from './configpeopleDialog'
import { mapState } from 'vuex'
import { lotteryDropdownList,findByCode } from '@/api/select'; // 所有的下拉框中的数据接口 
import { getPeopleData,enable } from '@/api/agentPlatForm/systemManage/ag_configOnlinePeople'
export default {
  components:{
    dialogDetail
  },
  data(){
    return{
      onlinePeople:{
        name:"",
        disable:""
      },
      loading:false,
      disabledALL:false,
      theStatus:[],
      enableOrUseDialog:false, // 启用弹框
      config_people_rowDataId:null,
      titleName:"看在线人数详情",
      dialogMt:""
    }
  },
  computed:{
    ...mapState({
      allData: state => state.ag_configOnlinePeople.allData,
      allDataCount: state => state.ag_configOnlinePeople.allData_total,
      currentPageSize: state => state.ag_configOnlinePeople.currentPageSize,
    }),
    size: {
      get(){
        return this.$store.state.ag_configOnlinePeople.pageSize;
      },
      set(item){
        return  item;
      }
    },
    page: {
      get(){
        return this.$store.state.ag_configOnlinePeople.page;
      },
      set(item){
        return  item;
      }
    },
    configOnlinePeople:{
      get(){
        return this.$store.state.ag_configOnlinePeople.configOnlinePeople;
      },
      set(item){
        return  item;
      }
    },
    disableArr:{
      get(){
        return this.$store.state.ag_configOnlinePeople.disableArr;
      },
      set(item){
        return  item;
      }
    },
  },
  mounted(){
    this.$nextTick(() => {
      this.judgeScree(this.dialogHeight);  // 判断屏幕大小进行操作
    })
    window.onresize = () =>{
      this.judgeScree(this.dialogHeight);
    };
  },
  methods:{ 
    getList() { // 查询
      this.getTableList();
    },
    resetTable() { // 重置
      this.$store.state.ag_configOnlinePeople.configOnlinePeople = {
        name: "",
        disable: ""
      }
    },
    getTableList(val) { // 请求表格数据
      this.config_people_rowDataId = "";
      this.tableRowData = "";
      if(!val) {
        val = 1;
      } 
      this.loading = true; // 请求接口时loading启用
      this.disabledALL=true; // 控制全局不可编辑
      this.$store.dispatch("getconfigOnlinePeoplePage",parseInt(val));
      let data = {
        name: this.configOnlinePeople.name,
        disable: this.configOnlinePeople.disable,
        page:this.page-1,
        size:this.size,
      }
      getPeopleData(data).then( res =>{
        if(res.data.success == 1){
          this.$store.dispatch("getconfigOnlinePeopleData",res.data.content);
          let currentPageSize = 2;
          if(res.data.content.content.length > 0) {
            currentPageSize = res.data.content.content.length;
          }else {
            currentPageSize = 2;
          }        
          this.$store.dispatch('getconfigOnlinePeopleTableHeight', currentPageSize)  
          this.$refs.multipleTable.bodyWrapper.scrollTop = 0; // 表格滚动条回滚到第一行       
        }else {
          this.$message.error(res,data.respMsg)
        }
        this.loading = false; // 接口返回数据时，loading禁用          
        this.disabledALL=false; // 控制全局不可编辑  
      })
    },
    handleCurrentChange(val) {  // 点击表格行
      if(val != null){
        this.tableRowData = val;
        this.config_people_rowDataId = val.id;
      }
    },
    judgeScree(val) { // 判断屏幕大小进行操作
      // let a = document.body.offsetHeight - val;
      // this.dialogMt = a / 2 + 'px';
      let a = document.body.offsetHeight - val;
      this.dialogMt = a / 2 + 'px';
      if(a < 0){
            this.dialogMt = 0 + 'px';
      }
    },
    enableOrUse(h) { // 启用
      this.dialogHeight = h;
      this.judgeScree(this.dialogHeight);
      debugger
      let indexId = this.config_people_rowDataId;
      if (!indexId) {
        this.$message.warning('请选择一条数据');
        return false;
      }
      if(!this.tableRowData.disable){
        this.$message.warning("该数据已开启，不可操作");
        return false;
      }
      this.onlinePeople.name = this.tableRowData.name;
      this.enableOrUseDialog = true;
    },
    confirmOkOrStop() { // 确认启用
      enable({id:this.config_people_rowDataId}).then(res => {
        if(res.data.success == 1){
          this.$message.success("启用成功");
        }else{
          this.$message.error(res.data.respMsg)
        }
         this.getTableList();
        this.enableOrUseDialog = false;
      })
    },
    checkDetail(h) { // 查看详情
      let indexId = this.config_people_rowDataId;
      if (!indexId) {
        this.$message.warning('请选择一条数据');
        return false;
      }
      this.dialogHeight = h;
      this.judgeScree(this.dialogHeight);
      this.$store.state.ag_configOnlinePeople.checkDetailDialog = true;
    }
  },
  created() {
    findByCode({code: 'ODDSLARGEVER_OPENABLE'}).then(res => {  // 初始化下拉列表
    this.$store.state.ag_configOnlinePeople.disableArr =[{value:"",name:"全部"}] 
      let resData = res.data;
      if(resData.success == 1) {
        let by_theStatus = resData.content['DISABLE']; // 初始化启用禁用
        resData.content['ODDSLARGEVER_OPENABLE'].map(item => {
          this.$store.state.ag_configOnlinePeople.disableArr.push({name: item.name == '是'? '已开启' : '未开启', value: item.value})
        })
      }
    })
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
        this.$store.state.ag_configOnlinePeople.allData = []
        this.$store.state.ag_configOnlinePeople.allData_total = 0;
        this.$store.state.ag_configOnlinePeople.page = 1;
        this.$store.state.ag_configOnlinePeople.size = 1000;
        this.$store.state.ag_configOnlinePeople.disableArr =[{value:"",name:"全部"}] 
        this.$store.state.ag_configOnlinePeople.configOnlinePeople ={name:"", disable:""}, // 头部搜索栏
        this.$store.dispatch('getconfigOnlinePeopleTableHeight', 2)
      }
    }else {
      if(this.$store.state.ag_configOnlinePeople.allData.length > 0) {
       // debugger
        this.getList()
      }
    }
  },  
}
</script>
